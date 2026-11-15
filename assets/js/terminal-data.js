---
layout: null
---
/* Generated from _config.yml and _data/*.yml so terminal output stays in sync. */
window.TerminalData = {
  about: {
    name: {{ site.author.name | jsonify }},
    role: {{ site.role | jsonify }},
    yearsExperience: {{ site.years_experience | jsonify }},
    specialties: "Maintenance, Architecture, Prototypes, Research, Documentation, and Testing",
    latestOrg: {{ site.data.experience.work.first.org | jsonify }},
    educationOrg: {{ site.data.experience.education.first.org | jsonify }}
  },
  skills: [
    {%- for group in site.data.skills %}
    {
      category: {{ group.category | jsonify }},
      items: [{% for item in group.items %}{{ item.name | jsonify }}{% unless forloop.last %}, {% endunless %}{% endfor %}]
    }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ],
  contact: {
    email: {{ site.email | jsonify }},
    socials: [
      {%- for social in site.data.social %}
      {
        name: {{ social.name | jsonify }},
        url: {{ social.url | jsonify }},
        label: {{ social.label | jsonify }}
      }{% unless forloop.last %},{% endunless %}
      {%- endfor %}
    ]
  },
  projects: [
    {%- for group in site.data.works %}
      {%- for item in group.items %}
    {
      name: {{ item.name | jsonify }},
      url: {{ item.url | jsonify }},
      tags: {{ item.tags | jsonify }}
    }{% unless forloop.parentloop.last and forloop.last %},{% endunless %}
      {%- endfor %}
    {%- endfor %}
  ]
};
