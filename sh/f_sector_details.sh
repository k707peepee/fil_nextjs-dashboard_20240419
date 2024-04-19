#!/bin/bash

#=================================================
# System Required: Ubuntu 
# Description: Filecoin
# Author: LiangPing
# BeginDate: 2024-4-17
# Company: 中康尚德健康管理(北京)有限公司
# Version: v1.0 - Store each miner's sector information into the designated server location
#=================================================  

# 钉钉播报变量
Dingding_Url="https://oapi.dingtalk.com/robot/send?access_token=d3c1a76b849582a4cd98336a165c2e26e4a4ef219ec62eda15662b4df5104038"

# 获取当前日期并生成目录名称
date_file=$(date -d "yesterday" +%Y%m%d)
input_directory="/space/filecoin_pg_data/sector_data/${date_file}_tmp" 
output_directory="/space/filecoin_pg_data/sector_data/${date_file}_csv"

# 创建输出目录（如果不存在）
mkdir -p "$output_directory"

# Docker 容器名称或 ID，用于连接到正确的容器
CONTAINER_NAME="filecoin-pg"

# PostgreSQL 连接信息
db_host="localhost"
db_port="5432"
db_name="txys"
db_user="txys"
db_password="txys2023"

table_name="f_base.f_sector_details"

# 发送钉钉消息函数
function SendMessageToDingding(){
    title="$1"
    text="$2"
    url="$3"

    curl -s "$Dingding_Url" -H 'Content-Type: application/json' -d "
    {
        \"actionCard\": {
            \"title\": \"${title}\",
            \"text\": \"${text}\",
            \"hideAvatar\": \"0\",
            \"btnOrientation\": \"0\",
            \"btns\": [
                {
                    \"title\": \"查看详情\",
                    \"actionURL\": \"${url}\"
                }
            ]
        },
        \"msgtype\": \"actionCard\"  
    }"
}

# 解析时间描述
function parse_time_description() {
    description=$1
    if [[ $description =~ "year" ]]; then
        echo "none"
        return
    fi
    weeks=$(echo $description | grep -oP '\d+(?= weeks)' || echo "0")
    days=$(echo $description | grep -oP '\d+(?= days)' || echo "0")
    hours=$(echo $description | grep -oP '\d+(?= hours)' || echo "0")

    total_days=$((weeks * 7 + days))
    echo $total_days
}

# 计算到期日期
function calculate_expiration_date() {
    start_date=$1
    description=$2
    total_days=$(parse_time_description "$description")

    if [[ $total_days == "none" ]]; then
        echo "none"
        return
    fi

    expiration_date=$(date -d "$start_date + $total_days days" "+%Y-%m-%d")
    today=$(date "+%Y-%m-%d")
    days_to_expiration=$(( ( $(date -d "$expiration_date" +%s) - $(date -d "$today" +%s) ) / 86400 ))

    expires_in_30_days=$( [[ $days_to_expiration -le 30 ]] && echo "1" || echo "0")
    echo "$days_to_expiration,$expires_in_30_days"
}

# 处理每个文件
for file in "$input_directory"/f*_sectors.csv; do
    output_file="$output_directory/$(basename "$file" .csv)_processed.csv"
   # echo "Node ID,Sector ID,Expiration Date,Expires in 30 Days,Deals,Update Date" > "$output_file"

    # 进度条初始化
    total_lines=$(grep -c '^' "$file")
    current_line=0

    while IFS= read -r line
    do
        ((current_line++))
        if (( total_lines > 0 )); then
            progress=$((current_line * 100 / total_lines))
            echo -ne "Processing $file: $progress% \r"
        fi

        IFS=',' read -ra PARTS <<< "$line"
        node_id=${PARTS[0]}
        sectorid=${PARTS[1]}
        start_date=${PARTS[2]}
        expiration_desc="${PARTS[7]} ${PARTS[8]} ${PARTS[9]} ${PARTS[10]}"
        deals=${PARTS[12]}
        update_date=$(date "+%Y-%m-%d")

        IFS=',' read -ra RESULT <<< "$(calculate_expiration_date "$start_date" "$expiration_desc")"
        expiration_date=${RESULT[0]}
        expire30=${RESULT[1]}

        if [[ $expiration_date != "none" ]]; then
            echo "$node_id,$sectorid,$expiration_date,$expire30,$deals,$update_date" >> "$output_file"
        else
            echo "$node_id,$sectorid,N/A,No,$deals,$update_date" >> "$output_file"
        fi
    done < "$file"
    echo -e "\n$(date '+%F %T') $(basename "$file") 文件转换为csv文件完成！"

    # 将文件拷贝进Docker容器
    docker cp "$output_file" "$CONTAINER_NAME:/tmp/$(basename "$output_file")"
    echo "$(date '+%F %T') $(basename "$file") csv文件已存入docker！"

    # 使用COPY命令将数据加载到数据库
    docker exec $CONTAINER_NAME psql "dbname=$db_name host=$db_host port=$db_port user=$db_user password=$db_password" -c "\copy $table_name(node_id, sectorid, expiration_date, expire30, deals, updatedate) FROM '/tmp/$(basename "$output_file")' WITH CSV;"
    echo "$(date '+%F %T') $(basename "$file") 数据成功导入数据库！"

    # 发送钉钉通知
    Subject='数据库-扇区数据存入'
    Body="####\t$(basename "$file")扇区数据已成功存入数据库\n"
    URL="http://113.250.13.252:54444/dashboard/sectors"
    SendMessageToDingding "$Subject" "$Body" "$URL"

    # 清理临时文件
  #  rm -f "$output_file"
done

echo "脚本执行完毕！"

