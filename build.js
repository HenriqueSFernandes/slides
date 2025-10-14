import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import { execSync } from "child_process";

const config = yaml.load(fs.readFileSync("config.yaml", "utf8"));
await fs.emptyDir("dist");

for (const slide of config.slides) {
	const inputPath = path.join("slides", slide.file);
	const outputDir = path.join("dist", slide.slug);
	await fs.ensureDir(outputDir);
	execSync(
		`npx @marp-team/marp-cli ${inputPath} --html --allow-local-files --output ${outputDir}/index.html`,
		{ stdio: "inherit" },
	);
	console.log(`Built ${slide.title}`);
}

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Slides</title>
		<style>
			body { font-family: sans-serif; max-width: 600px; margin: 2em auto; }
			a { display: block; margin: 0.5em 0; color: #0078ff; text-decoration: none; }
			a:hover { text-decoration: underline; }
		</style>
	</head>
	<body>
	<h1>Slides</h1>
	${config.slides.map((s) => `<a href="./${s.slug}/">${s.title}</a>`).join("")}
	</body>
</html>
`;

fs.writeFileSync("dist/index.html", indexHtml);
console.log("✅ All done!");
