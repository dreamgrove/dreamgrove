document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cbtext-placeholder').forEach(function(el) {
        var id = el.getAttribute('data-tag');
        var content = el.getAttribute('data-content');
        var negate = el.getAttribute('negate') === 'true' ? 'data-negate="true"' : '';
        var replacementHtml = '';

        // Check if the placeholder is the only child of a list item
        if (el.parentNode.tagName === 'LI' && el.parentNode.childNodes.length === 1) {
            replacementHtml = `'<ul ${negate} data-tag="` + id + '">' + content + '</ul>';
        } else if (el.parentNode.tagName === 'LI') {
            // Inline within a list item
            replacementHtml = `<span ${negate} data-tag="` + id + '">' + content + '</span>';
        } else {
            // Default case
            replacementHtml = `<span ${negate} data-tag="` + id + '">' + content + '</span>';
        }

        // Replace the placeholder with the appropriate HTML
        el.outerHTML = replacementHtml;
    });
});