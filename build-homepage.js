import fs from "fs-extra";
import yaml from "js-yaml";
import ejs from "ejs";

const config = yaml.load(fs.readFileSync("config.yaml", "utf8"));
const template = fs.readFileSync("templates/index.html", "utf8");
const html = ejs.render(template, { slides: config.slides });

fs.writeFileSync("dist/index.html", html);
console.log("Built homepage");
