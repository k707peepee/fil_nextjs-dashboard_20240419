#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
export PATH

#=================================================
#       System Required: Ubuntu 
#       Description: Filecoin
#       Author: LiangPing
#       BeginDate: 2024-4-9
#       Company: 中康尚德健康管理(北京)有限公司
#       Version: v1.0  将4台miner的信息存入pg数据库
#=================================================  

#钉钉播报变量
Subject=''
Body=''
URL=''
now_date=`date '+%F'`
now_time=`date '+%T'`
NowDate=`date "+<%Y-%m-%d>%H:%M:%S" `

# 发送钉钉函数
function SendMessageToDingding(){
  Dingding_Url="https://oapi.dingtalk.com/robot/send?access_token=44da275139f17077ab5fbf19458d1ba288933fffa8490fc4ed27a766a6a93f73"
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

# 生成日期变量
# 当前日期
date_file=`date "+%Y%m%d" `
# 当前日期，存储pg数据库格式
date_pg=`date "+%Y-%m-%d"`
# 7天前日期
date_file_7day=$(date -d "7 days ago" "+%Y%m%d")
# 30天前日期
date_file_10day=$(date -d "10 days ago" "+%Y%m%d")


echo -e "`date '+%F %T'` ${Info} 每日数据存入数据库脚本开始执行！"

# 获取miner机的每日信息
echo -e "`date '+%F %T'` ${Info} 开始获取各miner机数据！"
echo -e "`date '+%F %T'` ${Info} 开始获取f01180639数据！"
sshpass -p 019806 ssh -o StrictHostKeyChecking=no psdz@192.168.0.12 'cat /tmp/f01180639_miner_info.tmp' > /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp
echo -e "`date '+%F %T'` ${Info} 开始获取f019806数据！"
sshpass -p 019806 ssh -o StrictHostKeyChecking=no txys@192.168.0.72 'cat /tmp/f019806_miner_info.tmp' > /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp
echo -e "`date '+%F %T'` ${Info} 开始获取f01769576数据！"
sshpass -p 019806 ssh -o StrictHostKeyChecking=no psdz@192.168.0.110 'cat /tmp/f01769576_miner_info.tmp' > /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp
echo -e "`date '+%F %T'` ${Info} 开始获取f02146033数据！"
sshpass -p admin@123 ssh -o StrictHostKeyChecking=no psdz@192.168.0.78 'cat /tmp/f02146033_miner_info.tmp' > /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp
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
DB_TABLE="f_base.f_node_stats"

echo -e "`date '+%F %T'` ${Info} 开始对获取数据进行整理！"
echo -e "`date '+%F %T'` ${Info} 整理理论幸运值数据！"
# 表单字段：
# 超参数：官网幸运值
# 这部分无法从服务器端获取，需要从网页端获取数据进行计算
# 每隔一段时间这个参数都需要调整
# 24h平均提供存储服务收益，单位 FIL/TiB
filecoin_luck_="0.0047"
# 24h平均提供存储服务收益，单位 FIL/PiB
filecoin_luck=$(echo "scale=2; $filecoin_luck_*1024" | bc)

echo -e "`date '+%F %T'` ${Info} 整理节点号数据！"
# 节点号，文本类型
node_id1=`cat /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp | grep "Miner:" | awk '{print $2}'`
node_id2=`cat /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp | grep "Miner:" | awk '{print $2}'`
node_id3=`cat /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp | grep "Miner:" | awk '{print $2}'`
node_id4=`cat /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp | grep "Miner:" | awk '{print $2}'`

echo -e "`date '+%F %T'` ${Info} 整理算力数据！"
# 当前算力，精确数字类型
power1=`cat /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp | grep "Power:" | awk '{print $2}'`
power2=`cat /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp | grep "Power:" | awk '{print $2}'`
power3=`cat /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp | grep "Power:" | awk '{print $2}'`
power4=`cat /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp | grep "Power:" | awk '{print $2}'`

echo -e "`date '+%F %T'` ${Info} 整理owner余额数据！"
# owner余额，精确数字类型
owner_balance1=`cat /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp | grep "Worker Balance" | awk '{print $3}'`
owner_balance2=`cat /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp | grep "Worker Balance" | awk '{print $3}'`
owner_balance3=`cat /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp | grep "Worker Balance" | awk '{print $3}'`
owner_balance4=`cat /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp | grep "Worker Balance" | awk '{print $3}'`

echo -e "`date '+%F %T'` ${Info} 整理miner余额数据！"
# miner余额，精确数字类型
miner_balance1=`cat /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp | grep "Available" | head -n 1 | awk '{print $2}'`
miner_balance2=`cat /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp | grep "Available" | head -n 1 | awk '{print $2}'`
miner_balance3=`cat /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp | grep "Available" | head -n 1 | awk '{print $2}'`
miner_balance4=`cat /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp | grep "Available" | head -n 1 | awk '{print $2}'`

echo -e "`date '+%F %T'` ${Info} 整理锁仓余额数据！"
# 锁仓余额，精确数字类型
pledge_balance1=`cat /space/filecoin_pg_data/data/${date_file}_f01180639_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance2=`cat /space/filecoin_pg_data/data/${date_file}_f019806_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance3=`cat /space/filecoin_pg_data/data/${date_file}_f01769576_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance4=`cat /space/filecoin_pg_data/data/${date_file}_f02146033_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`

echo -e "`date '+%F %T'` ${Info} 整理7日变化数据！"
# 7日前的power值，精确数字类型
power_change_7_days_1_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f01180639_miner_info.tmp | grep "Committed:" | awk '{print $2}'`
power_change_7_days_2_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f019806_miner_info.tmp | grep "Committed:" | awk '{print $2}'`
power_change_7_days_3_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f01769576_miner_info.tmp | grep "Committed:" | awk '{print $2}'`
power_change_7_days_4_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f02146033_miner_info.tmp | grep "Committed:" | awk '{print $2}'`

# 7日变化值
power_change_7_days_1=$(printf "%.2f" "$(echo "scale=2; $power1-$power_change_7_days_1_" | bc)")
power_change_7_days_2=$(printf "%.2f" "$(echo "scale=2; $power2-$power_change_7_days_2_" | bc)")
power_change_7_days_3=$(printf "%.2f" "$(echo "scale=2; $power3-$power_change_7_days_3_" | bc)")
power_change_7_days_4=$(printf "%.2f" "$(echo "scale=2; $power4-$power_change_7_days_4_" | bc)")

echo -e "`date '+%F %T'` ${Info} 整理10日变化数据！"
# 10日前的power值，精确数字类型
power_change_10_days_1_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f01180639_miner_info.tmp | grep "Committed:" | awk '{print $2}'`
power_change_10_days_2_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f019806_miner_info.tmp | grep "Committed:" | awk '{print $2}'`
power_change_10_days_3_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f01769576_miner_info.tmp | grep "Committed:" | awk '{print $2}'`
power_change_10_days_4_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f02146033_miner_info.tmp | grep "Committed:" | awk '{print $2}'`
  
# 10日变化值
power_change_10_days_1=$(printf "%.2f" "$(echo "scale=2; $power1-$power_change_10_days_1_" | bc)")
power_change_10_days_2=$(printf "%.2f" "$(echo "scale=2; $power2-$power_change_10_days_2_" | bc)")
power_change_10_days_3=$(printf "%.2f" "$(echo "scale=2; $power3-$power_change_10_days_3_" | bc)")
power_change_10_days_4=$(printf "%.2f" "$(echo "scale=2; $power4-$power_change_10_days_4_" | bc)")
  
echo -e "`date '+%F %T'` ${Info} 整理7日变化率数据！"
# 7日变化率(小数)
power_change_ratio_7_days_1_=$(printf "%.2f" "$(echo "scale=2; $power_change_7_days_1 / $power_change_7_days_1_" | bc)")
power_change_ratio_7_days_2_=$(printf "%.2f" "$(echo "scale=2; $power_change_7_days_2 / $power_change_7_days_2_" | bc)")
power_change_ratio_7_days_3_=$(printf "%.2f" "$(echo "scale=2; $power_change_7_days_3 / $power_change_7_days_3_" | bc)")
power_change_ratio_7_days_4_=$(printf "%.2f" "$(echo "scale=2; $power_change_7_days_4 / $power_change_7_days_4_" | bc)")

# 7日变化率(百分比)
power_change_ratio_7_days_1=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_7_days_1_*100" | bc)")
power_change_ratio_7_days_2=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_7_days_2_*100" | bc)")
power_change_ratio_7_days_3=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_7_days_3_*100" | bc)")
power_change_ratio_7_days_4=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_7_days_4_*100" | bc)")

echo -e "`date '+%F %T'` ${Info} 整理10日变化率数据！"
# 10日变化率（小数）
power_change_ratio_10_days_1_=$(printf "%.2f" "$(echo "scale=2; $power_change_10_days_1 / $power_change_10_days_1_" | bc)")
power_change_ratio_10_days_2_=$(printf "%.2f" "$(echo "scale=2; $power_change_10_days_2 / $power_change_10_days_2_" | bc)")
power_change_ratio_10_days_3_=$(printf "%.2f" "$(echo "scale=2; $power_change_10_days_3 / $power_change_10_days_3_" | bc)")
power_change_ratio_10_days_4_=$(printf "%.2f" "$(echo "scale=2; $power_change_10_days_4 / $power_change_10_days_4_" | bc)")

# 10日变化率（百分比）
power_change_ratio_10_days_1=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_10_days_1_*100" | bc)")
power_change_ratio_10_days_2=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_10_days_2_*100" | bc)")
power_change_ratio_10_days_3=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_10_days_3_*100" | bc)")
power_change_ratio_10_days_4=$(printf "%.2f" "$(echo "scale=2; $power_change_ratio_10_days_4_*100" | bc)")


echo -e "`date '+%F %T'` ${Info} 当前理论幸运值基数: $luck FIL/PiB"

echo -e "`date '+%F %T'` ${Info} 整理7日幸运值数据！"
# 7日前锁仓余额，精确数字类型
pledge_balance_7day_1_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f01180639_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance_7day_2_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f019806_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance_7day_3_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f01769576_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance_7day_4_=`cat /space/filecoin_pg_data/data/${date_file_7day}_f02146033_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`

# 7日锁仓差值，精确数字类型，取绝对值
pledge_balance_7day_1=$(echo "scale=2; $pledge_balance1-$pledge_balance_7day_1_" | bc | tr -d '-')
pledge_balance_7day_2=$(echo "scale=2; $pledge_balance2-$pledge_balance_7day_2_" | bc | tr -d '-')
pledge_balance_7day_3=$(echo "scale=2; $pledge_balance3-$pledge_balance_7day_3_" | bc | tr -d '-')
pledge_balance_7day_4=$(echo "scale=2; $pledge_balance4-$pledge_balance_7day_4_" | bc | tr -d '-')
  
# 7日理论收益指,power 乘以 filecoin_luck 再乘以 7
filecoin_luck_7day_1=`echo "scale=2; $power1*$filecoin_luck*7" | bc`
filecoin_luck_7day_2=`echo "scale=2; $power2*$filecoin_luck*7" | bc`
filecoin_luck_7day_3=`echo "scale=2; $power3*$filecoin_luck*7" | bc`
filecoin_luck_7day_4=`echo "scale=2; $power4*$filecoin_luck*7" | bc`
  
# 7日实际幸运值，7日锁仓差值除以7日理论收益指 (小数)
lucky_value_7_days1_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_7day_1 / 0.75 / $filecoin_luck_7day_1" | bc)")
lucky_value_7_days2_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_7day_2 / 0.75 / $filecoin_luck_7day_2" | bc)")
lucky_value_7_days3_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_7day_3 / 0.75 / $filecoin_luck_7day_3" | bc)")
lucky_value_7_days4_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_7day_4 / 0.75 / $filecoin_luck_7day_4" | bc)")

# 7日实际幸运值，7日锁仓差值除以7日理论收益指 (百分比)
lucky_value_7_days1=$(printf "%.2f" "$(echo "scale=2; $lucky_value_7_days1_*100" | bc)")
lucky_value_7_days2=$(printf "%.2f" "$(echo "scale=2; $lucky_value_7_days2_*100" | bc)")
lucky_value_7_days3=$(printf "%.2f" "$(echo "scale=2; $lucky_value_7_days3_*100" | bc)")
lucky_value_7_days4=$(printf "%.2f" "$(echo "scale=2; $lucky_value_7_days4_*100" | bc)")


echo -e "`date '+%F %T'` ${Info} 整理10日幸运值数据！"
  
# 10日前锁仓余额，精确数字类型
pledge_balance_10day_1_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f01180639_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance_10day_2_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f019806_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance_10day_3_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f01769576_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
pledge_balance_10day_4_=`cat /space/filecoin_pg_data/data/${date_file_10day}_f02146033_miner_info.tmp | grep "Vesting:" | awk '{print $2}'`
  
# 10日锁仓差值，精确数字类型，取绝对值
pledge_balance_10day_1=$(echo "scale=2; $pledge_balance1-$pledge_balance_10day_1_" | bc | tr -d '-')
pledge_balance_10day_2=$(echo "scale=2; $pledge_balance2-$pledge_balance_10day_2_" | bc | tr -d '-')
pledge_balance_10day_3=$(echo "scale=2; $pledge_balance3-$pledge_balance_10day_3_" | bc | tr -d '-')
pledge_balance_10day_4=$(echo "scale=2; $pledge_balance4-$pledge_balance_10day_4_" | bc | tr -d '-')

  
# 10日理论收益指,power 乘以 filecoin_luck 再乘以 10
filecoin_luck_10day_1=`echo "scale=2; $power1*$filecoin_luck*10" | bc`
filecoin_luck_10day_2=`echo "scale=2; $power2*$filecoin_luck*10" | bc`
filecoin_luck_10day_3=`echo "scale=2; $power3*$filecoin_luck*10" | bc`
filecoin_luck_10day_4=`echo "scale=2; $power4*$filecoin_luck*10" | bc`

# 10日实际幸运值，10日锁仓差值除以10日理论收益指（小数）
lucky_value_10_days1_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_10day_1 / 0.75 / $filecoin_luck_10day_1" | bc)")
lucky_value_10_days2_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_10day_2 / 0.75 / $filecoin_luck_10day_2" | bc)")
lucky_value_10_days3_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_10day_3 / 0.75 / $filecoin_luck_10day_3" | bc)")
lucky_value_10_days4_=$(printf "%.2f" "$(echo "scale=2; $pledge_balance_10day_4 / 0.75 / $filecoin_luck_10day_4" | bc)")

# 10日实际幸运值，10日锁仓差值除以10日理论收益指（百分比）
lucky_value_10_days1=$(printf "%.2f" "$(echo "scale=2; $lucky_value_10_days1_*100" | bc)")
lucky_value_10_days2=$(printf "%.2f" "$(echo "scale=2; $lucky_value_10_days2_*100" | bc)")
lucky_value_10_days3=$(printf "%.2f" "$(echo "scale=2; $lucky_value_10_days3_*100" | bc)")
lucky_value_10_days4=$(printf "%.2f" "$(echo "scale=2; $lucky_value_10_days4_*100" | bc)")
  

echo -e "`date '+%F %T'` ${Info} 获取日期数据！"
# 获取数据的时间，日期和时间类型
time=$(date +%Y-%m-%d)

echo -e "`date '+%F %T'` ${Info} 数据整理结束！"
echo -e "`date '+%F %T'` ${Info} 开始将数据存入数据库"

# 获取数据插入语句
INSERT_SQL="INSERT INTO $DB_TABLE (node_id, power, owner_balance, miner_balance, pledge_balance, power_change_7_days, power_change_10_days, power_change_ratio_7_days, power_change_ratio_10_days, lucky_value_7_days, lucky_value_30_days, date) VALUES"

# 数据行，每一行的格式
DATA_ROWS=(
  "('$node_id1', '$power1', '$owner_balance1', '$miner_balance1', '$pledge_balance1', '$power_change_7_days_1', '$power_change_10_days_1', '$power_change_ratio_7_days_1', '$power_change_ratio_10_days_1', '$lucky_value_7_days1', '$lucky_value_10_days1', '$date_pg')",
  "('$node_id2', '$power2', '$owner_balance2', '$miner_balance2', '$pledge_balance2', '$power_change_7_days_2', '$power_change_10_days_2', '$power_change_ratio_7_days_2', '$power_change_ratio_10_days_2', '$lucky_value_7_days2', '$lucky_value_10_days2', '$date_pg')",
  "('$node_id3', '$power3', '$owner_balance3', '$miner_balance3', '$pledge_balance3', '$power_change_7_days_3', '$power_change_10_days_3', '$power_change_ratio_7_days_3', '$power_change_ratio_10_days_3', '$lucky_value_7_days3', '$lucky_value_10_days3', '$date_pg')",
  "('$node_id4', '$power4', '$owner_balance4', '$miner_balance4', '$pledge_balance4', '$power_change_7_days_4', '$power_change_10_days_4', '$power_change_ratio_7_days_4', '$power_change_ratio_10_days_4', '$lucky_value_7_days4', '$lucky_value_10_days4', '$date_pg')"
)

# 构建完整的插入语句
INSERT_STATEMENT="$INSERT_SQL ${DATA_ROWS[@]}"

# 使用 psql 命令执行插入语句，通过 Docker 容器连接
docker exec filecoin-pg psql "dbname=$DB_NAME host=$DB_HOST port=$DB_PORT user=$DB_USER password=$DB_PASS" -c "$INSERT_STATEMENT"

# 钉钉发送文档整理
Subject1='节点播报-PG数据存入'
time_task="####\t【存入时间】：\t$NowDate\n"
Task1="---\n####\t【$node_id1】今日数据\n"
detail="#####\t当前算力：$power1\tPiB\n#####\tOwner余额：$owner_balance1\tFil\n#####\tMiner余额：$miner_balance1\tFil\n#####\t锁仓余额：$pledge_balance1\tFil\n#####\t7日差值：$power_change_7_days_1\tPiB\n#####\t10日差值：$power_change_10_days_1\tPiB\n#####\t7日变化：$power_change_ratio_7_days_1\t%\n#####\t10日变化：$power_change_ratio_10_days_1\t%\n#####\t7日幸运：$lucky_value_7_days1\t%\n#####\t10日幸运：$lucky_value_10_days1\t%\n"
Task2="---\n####\t【$node_id2】今日数据\n"
detai2="#####\t当前算力：$power2\tPiB\n#####\tOwner余额：$owner_balance2\tFil\n#####\tMiner余额：$miner_balance2\tFil\n#####\t锁仓余额：$pledge_balance2\tFil\n#####\t7日差值：$power_change_7_days_2\tPiB\n#####\t10日差值：$power_change_10_days_2\tPiB\n#####\t7日变化：$power_change_ratio_7_days_2\t%\n#####\t10日变化：$power_change_ratio_10_days_2\t%\n#####\t7日幸运：$lucky_value_7_days2\t%\n#####\t10日幸运：$lucky_value_10_days2\t%\n"
Task3="---\n####\t【$node_id3】今日数据\n"
detai3="#####\t当前算力：$power3\tPiB\n#####\tOwner余额：$owner_balance3\tFil\n#####\tMiner余额：$miner_balance3\tFil\n#####\t锁仓余额：$pledge_balance3\tFil\n#####\t7日差值：$power_change_7_days_3\tPiB\n#####\t10日差值：$power_change_10_days_3\tPiB\n#####\t7日变化：$power_change_ratio_7_days_3\t%\n#####\t10日变化：$power_change_ratio_10_days_3\t%\n#####\t7日幸运：$lucky_value_7_days3\t%\n#####\t10日幸运：$lucky_value_10_days3\t%\n"
Task4="---\n####\t【$node_id4】今日数据\n"
detai4="#####\t当前算力：$power4\tPiB\n#####\tOwner余额：$owner_balance4\tFil\n#####\tMiner余额：$miner_balance4\tFil\n#####\t锁仓余额：$pledge_balance4\tFil\n#####\t7日差值：$power_change_7_days_4\tPiB\n#####\t10日差值：$power_change_10_days_4\tPiB\n#####\t7日变化：$power_change_ratio_7_days_4\t%\n#####\t10日变化：$power_change_ratio_10_days_4\t%\n#####\t7日幸运：$lucky_value_7_days4\t%\n#####\t10日幸运：$lucky_value_10_days4\t%\n"

luck_task="---\n####\t【理论收益】：\t$filecoin_luck\t(FiL/PiB)\n"
Body1=${time_task}${Task1}${detail}${Task2}${detai2}${Task3}${detai3}${Task4}${detai4}${luck_task}

Subject2='数据库-出现故障'
Body2="####\t数据插入失败\n####\t请管理员及时查看情况"

URL='http://113.250.13.252:54444/dashboard'

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



