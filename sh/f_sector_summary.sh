#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
export PATH

#=================================================
#       System Required: Ubuntu 
#       Description: Filecoin
#       Author: LiangPing
#       BeginDate: 2024-4-17
#       Company: 中康尚德健康管理(北京)有限公司
#       Version: v1.0  将每台miner机的sector统计信息（扇区总和，30天到期扇区）存入数据库服务器指定位置
#=================================================  

#钉钉播报变量
Subject=''
Body=''
URL=''
now_date=`date '+%F'`
now_time=`date '+%T'`
NowDate=`date "+<%Y-%m-%d>%H:%M:%S" `

# 获取当前时间
current_date=$(date "+%Y-%m-%d")

# 发送钉钉函数
function SendMessageToDingding(){
    # 正式用
    Dingding_Url="https://oapi.dingtalk.com/robot/send?access_token=d3c1a76b849582a4cd98336a165c2e26e4a4ef219ec62eda15662b4df5104038"
    # 测试用   
    # Dingding_Url="https://oapi.dingtalk.com/robot/send?access_token=855658259a5e75a9ded2a08862001c798a4a85d6399571e312400143a250c3c0"   
        curl -s "${Dingding_Url}" -H 'Content-Type: application/json' -d "
        {
                \"actionCard\": {
                \"title\": \"$1\",
                \"text\": \"$2\",
                \"hideAvatar\": \"0\",
                \"btnOrientation\": \"0\",
                \"btns\": [
                        {
                                \"title\": \"$1\",
                                \"actionURL\": \"$3\"
                        }
                        ]
                },
                \"msgtype\": \"actionCard\"  
        }"
}

# 获取当前日期并生成目录名称
date_file=$(date +%Y%m%d)
target_directory="/space/filecoin_pg_data/check_expire_data/${date_file}"  # 请替换为实际目录路径
temp_dir="/space/filecoin_pg_data/check_expire_data/${date_file}_tmp"

# 创建目录（如果不存在）
mkdir -p "$target_directory"
mkdir -p "$temp_dir"

echo -e "`date '+%F %T'` ${Info} 每日数据存入数据库脚本开始执行！"

# 获取miner机的每日信息
echo -e "`date '+%F %T'` ${Info} 开始获取各miner机数据！"
echo -e "`date '+%F %T'` ${Info} 开始获取 f01180639 数据！"
sshpass -p 019806 ssh -o StrictHostKeyChecking=no psdz@192.168.0.12 'cat /tmp/f01180639_sector_summary.tmp' > $target_directory/f01180639_sector_summary.tmp
echo -e "`date '+%F %T'` ${Info} 开始获取 f019806 数据！"
sshpass -p 019806 ssh -o StrictHostKeyChecking=no txys@192.168.0.72 'cat /tmp/f019806_sector_summary.tmp' > $target_directory/f019806_sector_summary.tmp
echo -e "`date '+%F %T'` ${Info} 开始获取 f01769576 数据！"
sshpass -p 019806 ssh -o StrictHostKeyChecking=no psdz@192.168.0.110 'cat /tmp/f01769576_sector_summary.tmp' > $target_directory/f01769576_sector_summary.tmp
echo -e "`date '+%F %T'` ${Info} 开始获取 f02146033 数据！"
sshpass -p admin@123 ssh -o StrictHostKeyChecking=no psdz@192.168.0.78 'cat /tmp/f02146033_sector_summary.tmp' > $target_directory/f02146033_sector_summary.tmp
echo -e "`date '+%F %T'` ${Info} 获取各miner机数据结束！"

# Docker 容器名称或 ID，用于连接到正确的容器
CONTAINER_NAME="filecoin-pg"

# PostgreSQL 连接信息
# 数据库主机地址
DB_HOST="localhost"
# 数据库端口
DB_PORT="5432"
# 数据库名称
DB_NAME="txys"
# 数据库用户名
DB_USER="txys"
# 数据库密码
DB_PASS="txys2023"

# 表单相关信息
# 表单名称
DB_TABLE="f_base.f_sector_summary"

echo -e "`date '+%F %T'` ${Info} 开始对获取数据进行整理！"

echo -e "`date '+%F %T'` ${Info} 整理节点号！"
# 节点号，文本类型
node_id1=`cat /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp | grep "Miner:" | awk '{print $2}'`
node_id2=`cat /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp | grep "Miner:" | awk '{print $2}'`
node_id3=`cat /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp | grep "Miner:" | awk '{print $2}'`
node_id4=`cat /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp | grep "Miner:" | awk '{print $2}'`

echo -e "`date '+%F %T'` ${Info} 整理扇区总数！"
# 扇区总数
sector_sum1=`cat /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp | grep "Proving:" | tail -n 1 | awk '{print $2}'`
sector_sum2=`cat /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp | grep "Proving:" | tail -n 1 | awk '{print $2}'`
sector_sum3=`cat /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp | grep "Proving:" | tail -n 1 | awk '{print $2}'`
sector_sum4=`cat /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp | grep "Proving:" | tail -n 1 | awk '{print $2}'`

echo -e "`date '+%F %T'` ${Info} 整理扇区到期时间！"
# 扇区到期时间
expiration_sum1=`cat ${target_directory}/f01180639_sector_summary.tmp | awk '{print $1}'`
expiration_sum2=`cat ${target_directory}/f019806_sector_summary.tmp | awk '{print $1}'`
expiration_sum3=`cat ${target_directory}/f01769576_sector_summary.tmp | awk '{print $1}'`
expiration_sum4=`cat ${target_directory}/f02146033_sector_summary.tmp | awk '{print $1}'`

# 更新时间
updatedate=$(date "+%Y-%m-%d")

# 获取数据插入语句
INSERT_SQL="INSERT INTO $DB_TABLE (node_id, sector_sum, expiration_sum, updatedate) VALUES"

# 数据行，每一行的格式
DATA_ROWS=(
  "('$node_id1', $sector_sum1, '$expiration_sum1', '$updatedate')",
  "('$node_id2', $sector_sum2, '$expiration_sum2', '$updatedate')",
  "('$node_id3', $sector_sum3, '$expiration_sum3', '$updatedate')",
  "('$node_id4', $sector_sum4, '$expiration_sum4', '$updatedate')"
)

# 构建完整的插入语句
INSERT_STATEMENT="$INSERT_SQL ${DATA_ROWS[@]}"

# 使用 psql 命令执行插入语句，通过 Docker 容器连接
docker exec filecoin-pg psql "dbname=$DB_NAME host=$DB_HOST port=$DB_PORT user=$DB_USER password=$DB_PASS" -c "$INSERT_STATEMENT"

# 钉钉发送文档整理
Subject1='扇区播报-PG数据存入'
time_task="####\t【存入时间】：\t$NowDate\n"
Task1="---\n####\t【$node_id1】今日数据\n"
detail="#####\t扇区总数：$sector_sum1\n#####\t30天到期：$expiration_sum1\n"
Task2="---\n####\t【$node_id2】今日数据\n"
detai2="#####\t扇区总数：$sector_sum2\n#####\t30天到期：$expiration_sum2\n"
Task3="---\n####\t【$node_id3】今日数据\n"
detai3="#####\t扇区总数：$sector_sum3\n#####\t30天到期：$expiration_sum3\n"
Task4="---\n####\t【$node_id4】今日数据\n"
detai4="#####\t扇区总数：$sector_sum4\n#####\t30天到期：$expiration_sum4\n"

Body1=${time_task}${Task1}${detail}${Task2}${detai2}${Task3}${detai3}${Task4}${detai4}


Subject2='数据库-出现故障'
Body2="####\t数据插入失败\n####\t请管理员及时查看情况"

URL='http://113.250.13.252:54444/dashboard/sectors'

# 检查插入是否成功
if [ $? -eq 0 ]; then
  echo "数据插入时间：$time "
  echo "数据插入成功"
  SendMessageToDingding $Subject1 $Body1 $URL

else
  echo "数据插入失败"
  SendMessageToDingding $Subject2 $Body2 $URL

fi

echo -e "`date '+%F %T'` ${Info} 数据存入数据库结束！"
echo -e "`date '+%F %T'` ${Info} 本次数据库脚本结束！"
