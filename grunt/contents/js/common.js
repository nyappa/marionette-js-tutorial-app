_.templateSettings = {
    escape      : /\{\{([\s\S]+?)\}\}/g,
    evaluate    : /\{\%-([\s\S]+?)\%\}/g,
    interpolate : /\{=([\s\S]+?)=\}/g,
};
