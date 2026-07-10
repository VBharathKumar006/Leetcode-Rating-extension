import urllib.request
import json
import pandas as pd
import requests
import io
import os

def extract_slug(url):
    if not isinstance(url, str):
        return ""
    # "https://leetcode.cn/problems/two-sum/" -> "two-sum"
    parts = url.strip('/').split('/')
    if len(parts) > 0:
        return parts[-1]
    return ""

def main():
    print("Fetching zerotrac rating data...")
    zerotrac_url = "https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/main/data.json"
    req = urllib.request.Request(zerotrac_url)
    with urllib.request.urlopen(req) as response:
        ratings_data = json.loads(response.read().decode())
    
    # Create a dictionary using TitleSlug as the key
    problems_dict = {}
    for item in ratings_data:
        slug = item.get("TitleSlug")
        if not slug:
            continue
        problems_dict[slug] = {
            "ID": item.get("ID"),
            "Rating": round(item.get("Rating", 0)),
            "Contest": item.get("ContestID_en", ""),
            "ContestSlug": item.get("ContestSlug", ""),
            "ProblemIndex": item.get("ProblemIndex", "")
        }

    print("Fetching stormsunshine level data...")
    levels_url = "https://raw.githubusercontent.com/stormsunshine/LeetCode-Levels/main/LeetCode%20Levels.xlsx"
    response = requests.get(levels_url)
    with io.BytesIO(response.content) as f:
        df = pd.read_excel(f)
    
    # Process level data
    for index, row in df.iterrows():
        url = row.get("链接", "")
        slug = extract_slug(url)
        if not slug:
            continue
        
        level = row.get("等级")
        if pd.isna(level):
            level = None
        else:
            level = int(level)

        if slug in problems_dict:
            problems_dict[slug]["Level"] = level
        else:
            problems_dict[slug] = {
                "ID": row.get("#", None),
                "Level": level
            }

    output_dir = "extension"
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "problem_data.json")
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(problems_dict, f, ensure_ascii=False)
    
    print(f"Generated {output_file} with {len(problems_dict)} problems.")

if __name__ == "__main__":
    main()
