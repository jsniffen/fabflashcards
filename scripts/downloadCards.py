import json
import requests

card_url = "https://github.com/the-fab-cube/flesh-and-blood-cards/raw/part-the-mistveil/json/english/card-flattened.json"
output_file_name = "cards.json"

cards = requests.get(card_url).json()
open(output_file_name, "w+").write(json.dumps(cards, indent=2))
