import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import { execSync } from "child_process";

const config = yaml.load(fs.readFileSync("config.yaml", "utf8"));

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
