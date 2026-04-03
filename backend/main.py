import os
import pymysql
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import json
from datetime import datetime
import random
import hashlib

app = FastAPI(title="天机阁 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

USE_SQLITE = os.getenv("USE_SQLITE", "false").lower() == "true"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def get_db_connection():
    use_sqlite = os.getenv("USE_SQLITE", "").lower() == "true"
    db_host = os.getenv("DB_HOST", "")
    
    if use_sqlite or not db_host:
        import sqlite3
        conn = sqlite3.connect('tianji.db')
        conn.row_factory = sqlite3.Row
        return conn
    
    db_port = os.getenv("DB_PORT", "3306")
    return pymysql.connect(
        host=db_host,
        port=int(db_port),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "genai123"),
        database=os.getenv("DB_NAME", "tianji"),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

def get_cursor(conn):
    is_sqlite = os.getenv("USE_SQLITE", "").lower() == "true"
    if is_sqlite:
        return conn.cursor()
    return conn.cursor()

def init_db():
    conn = get_db_connection()
    if conn is None:
        print("本地MySQL未连接，跳过数据库初始化")
        return
    try:
        cursor = get_cursor(conn)
        is_sqlite = os.getenv("USE_SQLITE", "").lower() == "true"
        if is_sqlite:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(50) UNIQUE,
                    phone VARCHAR(20) UNIQUE,
                    email VARCHAR(100) UNIQUE,
                    password VARCHAR(255) NOT NULL DEFAULT '',
                    points INTEGER DEFAULT 1000,
                    checked_in_today INTEGER DEFAULT 0,
                    last_checkin DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS readings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    divination_type VARCHAR(50),
                    question TEXT,
                    result TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """)
            conn.commit()
        else:
            with conn.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(50) UNIQUE,
                        phone VARCHAR(20) UNIQUE,
                        email VARCHAR(100) UNIQUE,
                        password VARCHAR(255) NOT NULL DEFAULT '',
                        points INT DEFAULT 1000,
                        checked_in_today BOOLEAN DEFAULT FALSE,
                        last_checkin DATE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS readings (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT,
                        divination_type VARCHAR(50),
                        question TEXT,
                        result TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id)
                    )
                """)
            conn.commit()
    finally:
        conn.close()

init_db()

class TarotRequest(BaseModel):
    question: str
    spread_type: str = "three_cards"

class LiuqiaoRequest(BaseModel):
    question: str

class BaziRequest(BaseModel):
    name: str
    gender: str
    birth_date: str
    birth_time: str
    birth_city: str

class ZiweiRequest(BaseModel):
    name: str
    gender: str
    birth_date: str
    birth_time: str
    birth_city: str

class DreamRequest(BaseModel):
    dream_content: str

class FortuneRequest(BaseModel):
    birth_date: str
    birth_time: str

class CompatibilityRequest(BaseModel):
    person1: dict
    person2: dict

TAROT_CARDS = [
    {"name": "愚人", "meaning": "新的开始、自由、冒险", "upright": "新的开始、自由、冒险精神、信任宇宙", "reversed": "鲁莽、冲动、缺乏方向"},
    {"name": "魔术师", "meaning": "创造力、技能、意志力", "upright": "创造力、技能、意志力、資源整合", "reversed": "欺诈、操控、缺乏方向"},
    {"name": "女祭司", "meaning": "直觉、智慧、内在", "upright": "直觉、智慧、内在声音、神秘", "reversed": "冷漠、忽视直觉、表面化"},
    {"name": "皇后", "meaning": "丰盛、母性、创造力", "upright": "丰盛、母性、创造力、自然", "reversed": "依赖、过度保护、空虚"},
    {"name": "皇帝", "meaning": "权威、稳定、领导力", "upright": "权威、稳定、领导力、秩序", "reversed": "专制、脆弱、缺乏纪律"},
    {"name": "教皇", "meaning": "传统、教导、精神", "upright": "传统、教导、精神指导、信仰", "reversed": "反叛、打破传统、独立"},
    {"name": "恋人", "meaning": "爱情、选择、和谐", "upright": "爱情、选择、和谐、价值观", "reversed": "失衡、冲突、诱惑"},
    {"name": "战车", "meaning": "胜利、意志、勇气", "upright": "胜利、意志、勇气、决心", "reversed": "攻击、冲突、缺乏意志"},
    {"name": "力量", "meaning": "勇气、内在力量、耐心", "upright": "勇气、内在力量、耐心、温柔", "reversed": "虚弱、缺乏自信、冲动"},
    {"name": "隐士", "meaning": "内省、智慧、指引", "upright": "内省、智慧、指引、独自", "reversed": "孤独、孤立、过度内省"},
    {"name": "命运轮", "meaning": "转折点、命运、循环", "upright": "转折点、命运、新的开始、机遇", "reversed": "停滞、命运不佳、错失机会"},
    {"name": "正义", "meaning": "公平、因果、真理", "upright": "公平、因果、真理、平衡", "reversed": "不公平、逃避责任、不诚实"},
    {"name": "倒吊人", "meaning": "暂停、牺牲、新的视角", "upright": "暂停、牺牲、新的视角、等待", "reversed": "停滞、牺牲过度、浪费"},
    {"name": "死神", "meaning": "结束、转变、重生", "upright": "结束、转变、重生、释放", "reversed": "抗拒改变、僵化、无法前进"},
    {"name": "节制", "meaning": "平衡、调和、中庸", "upright": "平衡、调和、中庸、耐心", "reversed": "失衡、极端、缺乏耐心"},
    {"name": "恶魔", "meaning": "束缚、欲望、物质", "upright": "束缚、欲望、物质主义、沉迷", "reversed": "解放、摆脱束缚、觉醒"},
    {"name": "塔", "meaning": "突变、破坏、启示", "upright": "突变、破坏、启示、觉醒", "reversed": "害怕改变、避免灾难、保持现状"},
    {"name": "星星", "meaning": "希望、灵感、疗愈", "upright": "希望、灵感、疗愈、乐观", "reversed": "绝望、失去信心、沮丧"},
    {"name": "月亮", "meaning": "幻觉、直觉、潜意识", "upright": "幻觉、直觉、潜意识、梦境", "reversed": "克服恐惧、面对现实、理性"},
    {"name": "太阳", "meaning": "快乐、成功、生命力", "upright": "快乐、成功、生命力、活力", "reversed": "忧郁、失败、缺乏活力"},
    {"name": "审判", "meaning": "觉醒、复活、评估", "upright": "觉醒、复活、评估、召唤", "reversed": "自我怀疑、拒绝觉醒、逃避"},
    {"name": "世界", "meaning": "完成、成就、循环", "upright": "完成、成就、循环、整合", "reversed": "未完成、停滞、等待新周期"},
]

def draw_tarot_cards(count: int) -> List[dict]:
    cards = random.sample(TAROT_CARDS, count)
    positions = ["过去", "现在", "未来"] if count == 3 else ["位置1", "位置2", "位置3", "位置4", "位置5", "位置6", "位置7", "位置8", "位置9", "位置10"]
    result = []
    for i, card in enumerate(cards):
        result.append({
            "position": positions[i] if i < len(positions) else f"位置{i+1}",
            "card": card
        })
    return result

async def call_deepseek(prompt: str, system_prompt: str = "你是一位专业的塔罗牌占卜师，精通西方塔罗牌和东方命理，请用中文回答用户的问题。"):
    if not DEEPSEEK_API_KEY:
        return {"error": "DeepSeek API密钥未配置"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DEEPSEEK_BASE_URL}/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                },
                timeout=60.0
            )
            if response.status_code == 200:
                data = response.json()
                return {"content": data["choices"][0]["message"]["content"]}
            else:
                return {"error": f"API错误: {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "天机阁 API v1.0", "status": "running"}

@app.post("/api/tarot")
async def tarot_reading(request: TarotRequest):
    cards = draw_tarot_cards(3)
    
    cards_info = "\n".join([
        f"{c['position']}: {c['card']['name']} - {c['card']['meaning']}"
        for c in cards
    ])
    
    prompt = f"""
用户问题: {request.question}

抽到的牌:
{cards_info}

请根据这些问题和牌面给出详细的塔罗牌解读，包括：
1. 每张牌的正位/逆位含义
2. 三张牌的关联性分析
3. 对用户问题的具体建议
"""
    
    system_prompt = """你是一位专业的塔罗牌占卜师，拥有多年的占卜经验，精通韦特塔罗牌78张牌的正逆位含义。
请用优雅、专业的中文为用户解读塔罗牌。
解读风格要富有哲理性和启发性，帮助用户获得指引。
"""
    
    interpretation = await call_deepseek(prompt, system_prompt)
    
    return {
        "cards": cards,
        "interpretation": interpretation,
        "question": request.question,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/liuqiao")
async def liuqiao_reading(request: LiuqiaoRequest):
    hexagrams = ["乾", "坤", "屯", "蒙", "需", "讼", "师", "比", "小畜", "履", "泰", "否", "同人", "大有", "谦", "豫", "随", "蛊", "临", "观", "噬嗑", "贲", "剥", "复", "无妄", "大畜", "颐", "大过", "坎", "离", "咸", "恒", "遯", "大壮", "晋", "明夷", "家人", "睽", "蹇", "解", "损", "益", "夬", "姤", "萃", "升", "困", "井", "革", "鼎", "震", "艮", "渐", "归妹", "丰", "旅", "巽", "兑", "涣", "节", "中孚", "小过", "既济", "未济"]
    
    primary = random.choice(hexagrams)
    secondary = random.choice(hexagrams)
    
    prompt = f"""
用户问题: {request.question}

起卦结果: 
本卦: {primary}
变卦: {secondary}

请根据易经六爻的原理，结合用户的问题给出详细解读：
1. 卦象的基本含义
2. 卦象之间的变化关系
3. 对用户问题的具体建议和指导
"""
    
    system_prompt = """你是一位专业的易经六爻占卜师，精通64卦的卦象含义和变化规律。
请用专业、深入的中文为用户解读六爻卦象。
解读要结合问卦者的具体问题，给出切实可行的指导。
"""
    
    interpretation = await call_deepseek(prompt, system_prompt)
    
    return {
        "hexagram": {"primary": primary, "secondary": secondary},
        "interpretation": interpretation,
        "question": request.question,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/bazi")
async def bazi_reading(request: BaziRequest):
    stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
    branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    elements = ["木", "火", "土", "金", "水"]
    
    year_stem = random.choice(stems)
    year_branch = random.choice(branches)
    month_stem = random.choice(stems)
    month_branch = random.choice(branches)
    day_stem = random.choice(stems)
    day_branch = random.choice(branches)
    hour_stem = random.choice(stems)
    hour_branch = random.choice(branches)
    
    prompt = f"""
用户信息:
- 姓名: {request.name}
- 性别: {request.gender}
- 出生日期: {request.birth_date} {request.birth_time}
- 出生地: {request.birth_city}

四柱排盘:
- 年柱: {year_stem}{year_branch}
- 月柱: {month_stem}{month_branch}
- 日柱: {day_stem}{day_branch}
- 时柱: {hour_stem}{hour_branch}

请根据生辰八字命理给出详细分析：
1. 八字基本结构分析
2. 五行强弱判断
3. 用神喜忌分析
4. 命主性格特点
5. 事业、财运、感情、健康方面的建议
"""
    
    system_prompt = """你是一位专业的八字命理师，精通四柱八字五行生克理论。
请用专业、准确的中文为用户解读八字命盘。
解读要结合用户的具体信息，给出详细的人生指导。
"""
    
    interpretation = await call_deepseek(prompt, system_prompt)
    
    return {
        "bazi": {
            "year": f"{year_stem}{year_branch}",
            "month": f"{month_stem}{month_branch}",
            "day": f"{day_stem}{day_branch}",
            "hour": f"{hour_stem}{hour_branch}"
        },
        "interpretation": interpretation,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/ziwei")
async def ziwei_reading(request: ZiweiRequest):
    palaces = ["命宫", "父母宫", "福德宫", "田宅宫", "事业宫", "交际宫", "迁移宫", "奴仆宫", "夫妻宫", "子女宫", "财帛宫", "疾病宫"]
    main_stars = ["紫微星", "天机星", "太阳星", "武曲星", "天同星", "廉贞星", "天府星", "太阴星", "贪狼星", "巨门星", "天相星", "天梁星", "七杀星", "破军星"]
    
    palace_stars = {}
    for palace in palaces:
        stars = random.sample(main_stars, random.randint(1, 3))
        palace_stars[palace] = stars
    
    prompt = f"""
用户信息:
- 姓名: {request.name}
- 性别: {request.gender}
- 出生日期: {request.birth_date} {request.birth_time}
- 出生地: {request.birth_city}

紫微斗数命盘:
{json.dumps(palace_stars, ensure_ascii=False, indent=2)}

请根据紫微斗数命理给出详细分析：
1. 命宫主星及其特点
2. 各宫位星曜分布分析
3. 四化飞星分析（禄、权、科、忌）
4. 事业、财运、感情、健康方面的运势分析
5. 大运流年建议
"""
    
    system_prompt = """你是一位专业的紫微斗数命理师，精通十二宫位和星曜组合。
请用专业、细致的中文为用户解读紫微斗数命盘。
解读要结合用户的出生信息，给出详细的人生指导。
"""
    
    interpretation = await call_deepseek(prompt, system_prompt)
    
    return {
        "chart": palace_stars,
        "interpretation": interpretation,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/dream")
async def dream_interpretation(request: DreamRequest):
    prompt = f"""
用户的梦境: {request.dream_content}

请根据周公解梦的传统理论，结合现代心理学给出详细解读：
1. 梦境的主要意象分析
2. 潜在的潜意识含义
3. 对用户现实生活的启示和建议
"""
    
    system_prompt = """你是一位专业的梦境分析师，精通周公解梦和弗洛伊德梦境理论。
请用富有洞察力的中文为用户解读梦境。
解读要帮助用户理解潜意识的信息，给予积极的心理启示。
"""
    
    interpretation = await call_deepseek(prompt, system_prompt)
    
    return {
        "dream": request.dream_content,
        "interpretation": interpretation,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/fortune")
async def fortune_reading(request: FortuneRequest):
    zodiac_signs = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"]
    
    prompt = f"""
用户出生信息: {request.birth_date} {request.birth_time}

请给出今日运势详解：
1. 整体运势
2. 爱情运势
3. 事业运势
4. 财运运势
5. 健康运势
6. 今日建议

使用星座运势的格式，以优雅的中文给出温暖的指引。
"""
    
    system_prompt = """你是一位专业的星座运势分析师，精通西方占星术。
请用优雅、温暖的中文为用户撰写每日运势。
语言要生动优美，给人带来积极的力量。
"""
    
    interpretation = await call_deepseek(prompt, system_prompt)
    
    return {
        "birth_info": f"{request.birth_date} {request.birth_time}",
        "interpretation": interpretation,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/compatibility")
async def compatibility_reading(request: CompatibilityRequest):
    prompt = f"""
合盘分析的两位用户信息:
一方: {json.dumps(request.person1, ensure_ascii=False)}
另一方: {json.dumps(request.person2, ensure_ascii=False)}

请根据八字命理给出合盘分析：
1. 五行互补分析
2. 日主关系分析
3. 性格契合度
4. 相处优势与挑战
5. 相处建议
"""
    
    system_prompt = """你是一位专业的命理合盘分析师，精通八字合婚理论。
请用专业、客观的中文为用户分析两人合盘。
解读要给出建设性的相处建议。
"""
    
    interpretation = await call_deepseek(prompt, system_prompt)
    
    return {
        "person1": request.person1,
        "person2": request.person2,
        "interpretation": interpretation,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))

class UserCreate(BaseModel):
    username: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    password: str

class LoginRequest(BaseModel):
    username: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    password: str

@app.post("/api/user/register")
async def register_user(request: UserCreate):
    conn = get_db_connection()
    if conn is None:
        return {"error": "数据库未连接"}
    
    if not request.username and not request.phone and not request.email:
        return {"error": "请提供用户名、手机号或邮箱"}
    
    if not request.password:
        return {"error": "请输入密码"}
    
    try:
        with conn.cursor() as cursor:
            if request.username:
                cursor.execute("SELECT id FROM users WHERE username = %s", (request.username,))
                if cursor.fetchone():
                    return {"error": "用户名已存在"}
            if request.phone:
                cursor.execute("SELECT id FROM users WHERE phone = %s", (request.phone,))
                if cursor.fetchone():
                    return {"error": "手机号已被注册"}
            if request.email:
                cursor.execute("SELECT id FROM users WHERE email = %s", (request.email,))
                if cursor.fetchone():
                    return {"error": "邮箱已被注册"}
            
            username = request.username or request.phone or request.email
            hashed_password = hash_password(request.password)
            
            cursor.execute(
                "INSERT INTO users (username, phone, email, password, points) VALUES (%s, %s, %s, %s, %s)",
                (username, request.phone, request.email, hashed_password, 1000)
            )
            conn.commit()
            
            cursor.execute("SELECT id, username, phone, email, points FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            if user:
                user.pop('password', None)
            return {"user": user, "message": "注册成功，获得1000积分"}
    finally:
        conn.close()

@app.post("/api/user/login")
async def login_user(request: LoginRequest):
    conn = get_db_connection()
    if conn is None:
        return {"error": "数据库未连接"}
    try:
        with conn.cursor() as cursor:
            if request.username:
                cursor.execute("SELECT id, username, phone, email, password, points, checked_in_today, last_checkin FROM users WHERE username = %s", (request.username,))
            elif request.phone:
                cursor.execute("SELECT id, username, phone, email, password, points, checked_in_today, last_checkin FROM users WHERE phone = %s", (request.phone,))
            elif request.email:
                cursor.execute("SELECT id, username, phone, email, password, points, checked_in_today, last_checkin FROM users WHERE email = %s", (request.email,))
            else:
                return {"error": "请输入用户名、手机号或邮箱"}
            user = cursor.fetchone()
            if not user:
                return {"error": "用户不存在，请先注册"}
            
            if not verify_password(request.password, user['password']):
                return {"error": "密码错误"}
            
            user.pop('password', None)
            return {"user": user, "message": "登录成功"}
    finally:
        conn.close()

@app.post("/api/user/checkin")
async def checkin(request: LoginRequest):
    conn = get_db_connection()
    if conn is None:
        return {"error": "数据库未连接"}
    try:
        with conn.cursor() as cursor:
            if request.username:
                cursor.execute("SELECT id, points, last_checkin FROM users WHERE username = %s", (request.username,))
            elif request.phone:
                cursor.execute("SELECT id, points, last_checkin FROM users WHERE phone = %s", (request.phone,))
            elif request.email:
                cursor.execute("SELECT id, points, last_checkin FROM users WHERE email = %s", (request.email,))
            else:
                return {"error": "请输入用户名、手机号或邮箱"}
            user = cursor.fetchone()
            if not user:
                return {"error": "用户不存在"}
            
            today = datetime.now().date()
            if user['last_checkin'] == today:
                return {"points": user['points'], "message": "今日已签到", "checked_in": True}
            
            bonus = random.randint(50, 100)
            new_points = user['points'] + bonus
            
            cursor.execute(
                "UPDATE users SET points = %s, last_checkin = %s, checked_in_today = TRUE WHERE username = %s",
                (new_points, today, request.username)
            )
            conn.commit()
            
            return {"points": new_points, "bonus": bonus, "message": f"签到成功，获得{bonus}积分", "checked_in": False}
    finally:
        conn.close()

@app.get("/api/user/history/{username}")
async def get_history(username: str):
    conn = get_db_connection()
    if conn is None:
        return {"error": "数据库未连接", "history": []}
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT divination_type, question, created_at FROM readings WHERE user_id = (SELECT id FROM users WHERE username = %s) ORDER BY created_at DESC LIMIT 20",
                (username,)
            )
            readings = cursor.fetchall()
            return {"history": readings}
    finally:
        conn.close()
