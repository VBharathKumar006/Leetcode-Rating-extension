# LeetCode Problem Rating Extension

Displays difficulty rating, contest origin, and level for LeetCode problems directly on the problem page.

![LeetCode Rating Extension Preview](extension/icon.png)

## Features
- **Ratings & Contests:** Fetches and displays problem difficulty ratings and the specific contest the problem appeared in (e.g., Weekly Contest 404 Q4).
- **Difficulty Levels:** Displays the problem's community-driven level (1-10).
- **Native Look & Feel:** Seamlessly integrates with the LeetCode dark mode UI by dynamically applying LeetCode's native CSS classes, matching padding, font sizes, and background colors exactly.
- **Fast & Private:** All data is bundled locally within the extension. No external API calls are made while browsing, ensuring instant load times and complete privacy.

## How to Install and Use

Currently, this extension is intended to be loaded as an "unpacked" extension in Chrome.

1. **Download the code:** Clone or download this repository to your local machine.
2. **Open Extensions Page:** Open Google Chrome and type `chrome://extensions/` in the URL bar.
3. **Enable Developer Mode:** Toggle the **Developer mode** switch in the top right corner.
4. **Load the Extension:** Click the **Load unpacked** button in the top left.
5. **Select the Folder:** Select the `extension` folder inside this repository.
6. **Done!** Navigate to any LeetCode problem page (e.g., [Two Sum](https://leetcode.com/problems/two-sum/)) and you will see the new badges right beneath the problem title!

## Updating the Data

The ratings and levels are stored statically inside `extension/problem_data.json`. If you want to pull the latest ratings (e.g., after a new weekend contest):

1. Ensure you have Python installed, along with `pandas`, `requests`, and `openpyxl`.
2. Run the generator script in the root directory:
   ```bash
   python generate_data.py
   ```
3. Go back to `chrome://extensions/` and click the **Refresh** icon on the LeetCode Problem Rating extension card to reload the updated data.

## Data Sources
- Ratings: [zerotrac/leetcode_problem_rating](https://github.com/zerotrac/leetcode_problem_rating)
- Levels: [stormsunshine/LeetCode-Levels](https://github.com/stormsunshine/LeetCode-Levels)
