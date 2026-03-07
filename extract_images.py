import re
import base64

file_path = r"c:\Users\soumi\Desktop\supaeval-dashboards\Metric Pack BE API Design.md"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

matches = re.finditer(r'\[image(\d+)\]:\s*<data:image/png;base64,(.*?)>', content)
for match in matches:
    img_num = match.group(1)
    b64_data = match.group(2)
    out_path = rf"c:\Users\soumi\Desktop\supaeval-dashboards\image{img_num}.png"
    with open(out_path, "wb") as img_file:
        img_file.write(base64.b64decode(b64_data))
    print(f"Saved {out_path}")
