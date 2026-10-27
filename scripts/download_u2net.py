import os
import urllib.request
import sys
import time

dest = 'scripts/u2net.onnx'
url = 'https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx'

def reporthook(count, block_size, total_size):
    global start_time
    if count == 0:
        start_time = time.time()
        return
    duration = time.time() - start_time
    progress_size = int(count * block_size)
    speed = int(progress_size / (1024 * (duration if duration > 0 else 1)))
    percent = int(count * block_size * 100 / total_size)
    if count % 100 == 0:
        sys.stdout.write(f"\rDownloading u2net.onnx: {percent}% - {progress_size / (1024*1024):.1f}MB - {speed} KB/s ")
        sys.stdout.flush()

if not os.path.exists(dest) or os.path.getsize(dest) < 100_000_000:
    print(f"Downloading from {url}...")
    urllib.request.urlretrieve(url, dest, reporthook)
    print("\nDownloaded successfully! Size:", os.path.getsize(dest))
else:
    print("Already downloaded:", dest, os.path.getsize(dest))
