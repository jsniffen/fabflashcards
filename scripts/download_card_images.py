import json
import requests

input_file_name = "filtered_cards.json"
assets_folder = "../assets"

cards = json.loads(open(input_file_name).read())

for card in cards:
    image_url = card["image_url"]
    image_content = requests.get(image_url).content
    with open(f"../assets/{card['id']}.png", "wb+") as image_file:
        image_file.write(image_content)
