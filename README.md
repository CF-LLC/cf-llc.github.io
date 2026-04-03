# Cooper Featherstone LLC Website

This repository contains the source code for the Cooper Featherstone LLC website, a showcase of innovative solutions and exceptional results.

## Description

This website is built using Next.js and deployed on GitHub Pages. It features a responsive design, project showcases, and contact information for Cooper Featherstone LLC.

## Features

- Responsive design
- Project showcase
- Contact information
- Integration with GitHub for displaying recent projects

## Temporarily Hide Projects

You can hide projects from the website without deleting them.

1. Open `public/projects.config.json`.
2. Add the repo `id` values to `hiddenProjectIds`, or add repo names to `hiddenProjectNames`.
3. Commit and deploy when ready.

Example:

```json
{
	"hiddenProjectIds": [123456789],
	"hiddenProjectNames": ["old-landing-page", "demo-app"]
}
```

To show a project again, remove it from those arrays.

## Technologies Used

- Next.js
- React
- Tailwind CSS
- GitHub Pages for hosting

