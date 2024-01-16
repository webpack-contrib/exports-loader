module.exports = {
  "*": [
    "prettier --write --ignore-unknown",
    "cspell --no-must-find-files --cache",
  ],
  "*.js": ["eslint --cache --fix"],
};
