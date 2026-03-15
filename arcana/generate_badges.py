import os
import textwrap

# Badge Configuration
WIDTH = 400
HEIGHT = 280 # Increased height for content
BADGE_DIR = "arcana/assets/badges"

# Color Map
COLORS = {
    "White": "#F9FAFB",
    "Blue": "#3B82F6",
    "Black": "#9CA3AF",
    "Red": "#EF4444",
    "Green": "#10B981"
}

# Identities Data
# "Nerd Approved" Thematic Emojis
IDENTITIES = [
    # Single
    {"id": "WHITE", "name": "White", "colors": ["White"], "emoji": "☀️", "desc": "At my best, I am the shield that protects the weak and the structure that upholds society."},
    {"id": "BLUE", "name": "Blue", "colors": ["Blue"], "emoji": "💧", "desc": "At my best, I am the innovator who solves impossible problems and the scholar who seeks objective truth."},
    {"id": "BLACK", "name": "Black", "colors": ["Black"], "emoji": "💀", "desc": "At my best, I am pragmatic, honest about reality, and fiercely independent."},
    {"id": "RED", "name": "Red", "colors": ["Red"], "emoji": "🔥", "desc": "At my best, I am passionate, creative, and undeniably authentic."},
    {"id": "GREEN", "name": "Green", "colors": ["Green"], "emoji": "🌳", "desc": "At my best, I am grounded, nurturing, and in harmony with the world around me."},

    # Two Color (Guilds)
    {"id": "AZORIUS", "name": "Azorius", "colors": ["White", "Blue"], "emoji": "🏛️", "desc": "At my best, I build systems that create perfect justice and societal harmony."}, # Senate/Law
    {"id": "DIMIR", "name": "Dimir", "colors": ["Blue", "Black"], "emoji": "🕸️", "desc": "At my best, I am the mastermind who achieves goals through subtlety and intelligence."}, # Web of secrets/lies
    {"id": "RAKDOS", "name": "Rakdos", "colors": ["Black", "Red"], "emoji": "🎭", "desc": "At my best, I live without regret, embracing every moment with fierce authenticity."}, # Performance/Carnival
    {"id": "GRUUL", "name": "Gruul", "colors": ["Red", "Green"], "emoji": "🐗", "desc": "At my best, I am honest, loyal, and inextricably connected to my primal nature."}, # Ilharg/Boar/Beasts
    {"id": "SELESNYA", "name": "Selesnya", "colors": ["Green", "White"], "emoji": "🌻", "desc": "At my best, I create inclusive societies where everyone supports one another."}, # Nature + Light/Sun
    {"id": "ORZHOV", "name": "Orzhov", "colors": ["White", "Black"], "emoji": "⚖️", "desc": "At my best, I provide structure and security for those loyal to me, building legacies."}, # Debt/Scales/Balance
    {"id": "IZZET", "name": "Izzet", "colors": ["Blue", "Red"], "emoji": "🧪", "desc": "At my best, I am a genius inventor who pushes the boundaries of what is possible."}, # Experimentation
    {"id": "GOLGARI", "name": "Golgari", "colors": ["Black", "Green"], "emoji": "🍄", "desc": "At my best, I understand that death is just part of life, and I find strength in places others overlook."}, # Fungus/Rot
    {"id": "BOROS", "name": "Boros", "colors": ["Red", "White"], "emoji": "⚔️", "desc": "At my best, I am a hero who fights fearlessly for the innocent and upholds righteous laws."}, # Combat/Legion
    {"id": "SIMIC", "name": "Simic", "colors": ["Blue", "Green"], "emoji": "🧬", "desc": "At my best, I improve upon nature to create a healthier, stronger world."}, # Evolution/DNA

    # Three Color (Shards)
    {"id": "BANT", "name": "Bant", "colors": ["White", "Blue", "Green"], "emoji": "🏰", "desc": "At my best, I represent the pinnacle of civilized society, where disputes are settled by code."}, # Castles/Knights
    {"id": "ESPER", "name": "Esper", "colors": ["White", "Blue", "Black"], "emoji": "🦾", "desc": "At my best, I create flawless systems where destiny is engineered, not left to chance."}, # Etherium/Cyborgs
    {"id": "GRIXIS", "name": "Grixis", "colors": ["Blue", "Black", "Red"], "emoji": "🧟", "desc": "At my best, I am a survivor who refuses to be constrained by morality or tradition."}, # Undeath
    {"id": "JUND", "name": "Jund", "colors": ["Black", "Red", "Green"], "emoji": "🌋", "desc": "At my best, I am a mighty predator, honest and unyielding in the face of a harsh world."}, # Volcano/Primal
    {"id": "NAYA", "name": "Naya", "colors": ["Red", "Green", "White"], "emoji": "🦁", "desc": "At my best, I celebrate existence with unbridled joy and protect my flock with devotion."}, # Behemoths/Leonin

    # Three Color (Wedges)
    {"id": "ABZAN", "name": "Abzan", "colors": ["White", "Black", "Green"], "emoji": "🛡️", "desc": "At my best, I am an unshakeable fortress that ensures the survival of my kin at any cost."}, # Dragon Scale
    {"id": "JESKAI", "name": "Jeskai", "colors": ["White", "Blue", "Red"], "emoji": "🧘", "desc": "At my best, I am the martial artist who strikes with perfect clarity and purpose."}, # Dragon Eye/Monk
    {"id": "MARDU", "name": "Mardu", "colors": ["White", "Black", "Red"], "emoji": "🦅", "desc": "At my best, I am a fearless commander who inspires absolute loyalty and achieves victories."}, # Dragon Wings/Speed
    {"id": "SULTAI", "name": "Sultai", "colors": ["Blue", "Black", "Green"], "emoji": "🐍", "desc": "At my best, I am the apex of adaptability, using every tool available to thrive."}, # Dragon Fang/Naga
    {"id": "TEMUR", "name": "Temur", "colors": ["Blue", "Red", "Green"], "emoji": "🐻", "desc": "At my best, I am the shaman who understands the deep, elemental truths of the universe."}, # Dragon Claw/Bears

    # Four Color (Nephilim/Commander)
    {"id": "NO_GREEN", "name": "Artifice", "colors": ["White", "Blue", "Black", "Red"], "emoji": "🤖", "desc": "At my best, I create technological wonders and complex societies."}, # Machine/Artificial
    {"id": "NO_WHITE", "name": "Chaos", "colors": ["Blue", "Black", "Red", "Green"], "emoji": "🌀", "desc": "At my best, I am a force of pure, adaptive evolution."}, # Maelstrom
    {"id": "NO_BLUE", "name": "Aggression", "colors": ["White", "Black", "Red", "Green"], "emoji": "🩸", "desc": "At my best, I am decisive, bold, and unstoppable."}, # Blood/War
    {"id": "NO_BLACK", "name": "Altruism", "colors": ["White", "Blue", "Red", "Green"], "emoji": "🤝", "desc": "At my best, I create a utopia where everyone acts for the greater good."}, # Unity/Group Hug
    {"id": "NO_RED", "name": "Growth", "colors": ["White", "Blue", "Black", "Green"], "emoji": "🌱", "desc": "At my best, I am the engine of destiny, moving inexorably forward."}, # Proliferation/Stagnation

    # Five Color
    {"id": "WUBRG", "name": "Five Color", "colors": ["White", "Blue", "Black", "Red", "Green"], "emoji": "🌈", "desc": "At my best, I have the perspective to see every side and the adaptability to face any challenge."},
]

def generate_svg(identity):
    filename = identity["id"].lower() + ".svg"
    path = os.path.join(BADGE_DIR, filename)

    # Text Wrapping
    wrapper = textwrap.TextWrapper(width=50) # Adjust width based on font size/SVG width
    desc_lines = wrapper.wrap(identity["desc"])

    # Calculate stripes
    num_colors = len(identity["colors"])
    stripe_width = WIDTH / num_colors if num_colors > 0 else WIDTH

    svg_content = f'''<svg width="{WIDTH}" height="{HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&amp;display=swap');
      .title {{ font-family: 'Roboto', sans-serif; font-weight: bold; font-size: 28px; fill: #F3F4F6; }}
      .emoji {{ font-size: 80px; }}
      .desc {{ font-family: 'Roboto', sans-serif; font-size: 14px; fill: #D1D5DB; }}
      .footer {{ font-family: 'Roboto', sans-serif; font-size: 10px; fill: #9CA3AF; }}
    </style>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#1F2937" rx="12" ry="12" />

  <!-- Color Stripes at Top (Header) -->
  <g>'''

    for i, color_name in enumerate(identity["colors"]):
        color_hex = COLORS.get(color_name, "#CCCCCC")
        x = i * stripe_width
        svg_content += f'\n    <rect x="{x}" y="0" width="{stripe_width}" height="10" fill="{color_hex}" />'

    svg_content += f'''
  </g>

  <!-- Main Title -->
  <text x="50%" y="50" text-anchor="middle" class="title">{identity["name"].upper()}</text>

  <!-- Central Emoji Icon -->
  <text x="50%" y="140" text-anchor="middle" dominant-baseline="middle" class="emoji">{identity["emoji"]}</text>

  <!-- Description Text (Multi-line) -->
  <g transform="translate(0, 190)">'''

    line_height = 20
    for i, line in enumerate(desc_lines):
        svg_content += f'\n    <text x="50%" y="{i * line_height}" text-anchor="middle" class="desc">{line}</text>'

    svg_content += f'''
  </g>

  <!-- Footer -->
  <text x="50%" y="{HEIGHT - 15}" text-anchor="middle" class="footer">CLICK TO TAKE THE QUIZ</text>

  <!-- Border -->
  <rect x="0" y="0" width="{WIDTH}" height="{HEIGHT}" fill="none" stroke="#374151" stroke-width="4" rx="12" ry="12" />
</svg>'''

    with open(path, "w") as f:
        f.write(svg_content)
    print(f"Generated {path}")

if __name__ == "__main__":
    if not os.path.exists(BADGE_DIR):
        os.makedirs(BADGE_DIR)

    for identity in IDENTITIES:
        generate_svg(identity)
