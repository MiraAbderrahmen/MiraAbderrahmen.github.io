# Abderrahmen Mira – Portfolio

Personal portfolio site for Abderrahmen Mira, Data Engineer in Salzburg, Austria.
Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Structure

```
index.html          Page content
css/style.css       Styles, light and dark theme
js/main.js          Stream animation, pipeline stages, theme toggle, copy email
assets/profile.jpg  Profile photo
assets/favicon.svg  Site icon
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a new repository on GitHub (for example `portfolio`, or `<your-username>.github.io` for a root URL).
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings > Pages**, set **Source** to `Deploy from a branch`, choose `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Deploy on Netlify

Either drag this folder onto https://app.netlify.com/drop, or connect the GitHub repository
(no build command, publish directory `.`). You can then rename the site, for example
`abderrahmen-mira.netlify.app`.

## Editing

- Text and experience: `index.html`
- Colours: the variables at the top of `css/style.css` (`--accent` is the purple, `--event` the amber)
- Pipeline project stages: the `stages` list in `js/main.js`

### Add a CV download button

Put your PDF in `assets/` (for example `assets/Abderrahmen_Mira_CV.pdf`) and add this next to the
"Email me" button in `index.html`:

```html
<a class="btn ghost" href="assets/Abderrahmen_Mira_CV.pdf" download>Download CV</a>
```
