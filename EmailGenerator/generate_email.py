import os
import shutil

# Get list of brands
with open("brands_list.txt", "r") as bl:
    brands = bl.read().splitlines()

# Remove and make a new "emails" directory to store results
if os.path.exists("emails"):
    shutil.rmtree("emails")
os.mkdir("emails")

for brand in brands:
    with open("email_template.txt", "r") as et:
        et_data = et.read()
        et_data = et_data.replace("[store]", brand)
        with open(f"emails/{brand}.txt", "w") as be:
            be.write(et_data)
  
