import datetime
import re

# 示例数据
data = [
    "f02146033,0,2024-04-15,Proving,YES,YES,4358834,(in,26,weeks,2,days),CC",
    "f02146033,1,2024-04-15,Proving,YES,YES,4358817,(in,2,weeks,2,days),CC",
    "f02146033,1,2024-04-15,Proving,YES,YES,4358817,(1 year 32 weeks ago),CC",
    "f02146033,1,2024-04-15,Proving,YES,YES,4358817,(in 60 days 13 hours),CC",
    "f02146033,1,2024-04-15,Proving,YES,YES,4358817,(in,2,weeks,2,days),CC"
]

# 解析到期时间描述并计算到期日期和是否在30天内到期
def parse_time_description(description):
    if "year" in description:
        return None  # 如果含有"year"，返回None表示不到期
    nums = list(map(int, re.findall(r'\d+', description)))
    days = hours = 0
    if "days" in description:
        days = nums[-2]
    if "hours" in description:
        hours = nums[-1]
    weeks = nums[0] if "weeks" in description else 0
    if "week" in description and not "weeks":
        weeks = nums[-4]  # This is for 'in 4 days 13 hours'
    delta = datetime.timedelta(weeks=weeks, days=days, hours=hours)
    return delta

def calculate_expiration_date(start_date, description):
    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
    delta = parse_time_description(description)
    if delta is None:
        return None, False  # 设定未来的一个不到期的日期和不会在30天内到期
    expiration_date = start_date + delta
    today = datetime.datetime.today()
    days_to_expiration = (expiration_date - today).days
    expires_in_30_days = days_to_expiration <= 30
    return expiration_date.date(), expires_in_30_days

# 处理数据
for line in data:
    parts = line.split(',')
    node_id = parts[0]
    sector_id = parts[1]
    start_date = parts[2]
    expiration_desc = ''.join(parts[7:11])
    
    expiration_date, expires_soon = calculate_expiration_date(start_date, expiration_desc)
    if expiration_date:
        print(f"Node ID: {node_id}, Sector ID: {sector_id}, Expiration Date: {expiration_date}, Expires in 30 days: {'Yes' if expires_soon else 'No'}")
    else:
        print(f"Node ID: {node_id}, Sector ID: {sector_id}, Expiration Date: Does not expire, Expires in 30 days: No")
