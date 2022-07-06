module.exports = (name, stats) => {
  const { modules } = stats.toJson({ source: true });
  const module = modules.find((m) => m.name === name);

  return module.source;
};
