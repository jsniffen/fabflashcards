import json

input_file_name = "cards.json"
output_file_name = "cards.js"
keys = ["power", "cost", "defense", "functional_text_plain", "health", "id", "image_url", "name", "set_id", "pitch", "types"]

all_cards = json.loads(open(input_file_name).read())

card_ids = set()
cards = []

excluded_cards = [
    "MST225", "MST226", "MST227", "MST228", "MST229", "MST230", "MST231", "MST232", "MST233", "MST234", "MST235", "MST236", "MST237", "MST238",
]

for card in all_cards:
    if card["set_id"] != "MST":
        continue

    if "Hero" in card["types"]:
        continue

    if card["rarity"] in ["T", "L", "F"]:
        continue

    if card["art_variation"]:
        continue

    if card["id"] in card_ids or card["id"] in excluded_cards:
        continue

    card_ids.add(card["id"])

    output = {}

    for k in keys:
        output[k] = card[k]

    cards.append(output)

for i in range(0, 239):
    want = f"MST{(i):03}"
    if want not in card_ids:
        print(f"missing: {want}")

output_file_content = f"export const cards = {json.dumps(cards)}"
open(output_file_name, "w+").write(output_file_content)
