import os

files = [
    r"c:\Users\Asus\Desktop\flipkart Prototype\public-dashboard.html",
    r"c:\Users\Asus\Desktop\flipkart Prototype\controller-dashboard.html"
]

bad_syntax = """function tickClock() {
  const now = new Date();
  document.getElementById('live-clock').textContent = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
}"""

good_syntax = """function tickClock() {
  const now = new Date();
  document.getElementById('live-clock').textContent = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}"""

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if bad_syntax in content:
        content = content.replace(bad_syntax, good_syntax)
        print(f"Fixed {os.path.basename(fpath)}")
    else:
        print(f"Bad syntax not found in {os.path.basename(fpath)}")
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
