/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

// The rich-textarea's change event bubbles to the container

var elements = document.body.querySelectorAll("[data-form-element-type='rich-textarea']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var contentContainer = element.querySelector('div');

        var noLines = ['true'].indexOf(contentContainer.getAttribute('noLines')) !== -1;
        var autoHighlight = contentContainer.getAttribute('autoHighlight');
        if (autoHighlight === null) {
            autoHighlight = '';
        }
        autoHighlight = autoHighlight.trim();
        if (autoHighlight.length > 0) {
            autoHighlight = autoHighlight.split(',');
            autoHighlight = autoHighlight.map(function (v) {
                return v.trim();
            });
        } else {
            autoHighlight = [];
        }
        var hasAutoHighlight = function (name) {
            if (autoHighlight.indexOf('*') !== -1) {
                return true;
            }
            if (autoHighlight.indexOf(name) !== -1) {
                return true;
            }
            return false;
        };

        var processChange = function (limit) {
            var hasChange = false;
            var children = contentContainer.querySelectorAll('*'); // remove all attributes
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var childTagName = child.tagName.toLowerCase();
                if (noLines) {
                    if (childTagName === 'br') {
                        if (child.nextSibling !== null) {
                            var newChild = document.createElement('span');
                            child.parentNode.replaceChild(newChild, child);
                            //console.log('change - remove br');
                            hasChange = true;
                        }
                    } else if (childTagName === 'div') {
                        var newChild = document.createElement('span');
                        newChild.innerHTML = child.innerHTML;
                        child.parentNode.replaceChild(newChild, child);
                        child = newChild;
                        //console.log('change - convert div to span');
                        hasChange = true;
                    }
                }
                if (['br', 'span', 'div', 'a'].indexOf(childTagName) === -1) {
                    var newChild = document.createElement(window.getComputedStyle(child).display === 'block' ? 'div' : 'span');
                    newChild.innerHTML = child.innerHTML;
                    child.parentNode.replaceChild(newChild, child);
                    child = newChild;
                    //console.log('change - convert ' + childTagName);
                    hasChange = true;
                }
                var childAttributes = child.attributes;
                if (childAttributes.length > 0) {
                    var attributesToRemove = [];
                    for (var j = 0; j < childAttributes.length; j++) {
                        attributesToRemove.push(childAttributes[j].name);
                    }
                    for (var j = 0; j < attributesToRemove.length; j++) {
                        var attributeToRemove = attributesToRemove[j];
                        if (childTagName === 'a' && ['data-rich-textarea-link-type'].indexOf(attributeToRemove) !== -1) {
                            continue;
                        }
                        child.removeAttribute(attributeToRemove);
                        //console.log('change - remove attribute ' + attributeToRemove);
                        hasChange = true;
                    }
                }
            }
            var contentContainerChildren = contentContainer.childNodes;
            if (contentContainer.childNodes.length === 1) {
                var firstChild = contentContainer.firstChild;
                if (firstChild.nodeType === 1 && firstChild.tagName.toLowerCase() === 'br') {
                    contentContainer.removeChild(firstChild);
                    //console.log('change - remove last br');
                    hasChange = true;
                }
            }
            if (hasChange) {
                limit--;
                if (limit > 0) {
                    processChange(limit);
                }
            }
        };

        var getCaretPosition = function () {
            var selection = window.getSelection();
            if (selection.type === "Caret") {
                var result = {
                    node: selection.anchorNode,
                    offset: selection.anchorOffset
                };
                //console.log('getCaretPosition', result);
                return result;
            }
            return null;
        };

        var setCaretPosition = function (node, offset) {
            //console.log('setCaretPosition', node.nodeValue, offset);
            try {
                var selection = window.getSelection();
                var range = new Range();
                range.setStart(node.nodeType === 1 ? node.firstChild : node, offset);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (e) {
                // ignore
            }
        };

        var tooltipID = null;
        var tooltip = null;
        //var lastShownTooltipElement = null;

        var showTooltip = function (target) {
            var execute = function () {
                if (tooltipID === null) {
                    tooltipID = tooltip.generateID();
                }
                var type = target.getAttribute('data-rich-textarea-link-type');
                var text = target.innerText;
                var html = '';
                if (type === 'url') {
                    if (text.indexOf('//') === -1) {
                        text = 'https://' + text;
                    }
                    html = '<a href="' + text + '" target="_blank" rel="noopener">Open URL</a>';
                } else if (type === 'email') {
                    html = '<a href="mailto:' + text + '" target="_blank" rel="noopener">Email</a>';
                } else if (type === 'phone') {
                    html = '<a href="tel:' + text + '" target="_blank" rel="noopener">Call</a>';
                } else if (type === 'tag') {

                }
                if (html.length === 0) {
                    return;
                }
                // var event = new Event('beforeshowhighlighttooltip', { 'bubbles': true });
                // event.highlightTooltipHTML = html;
                // event.highlightType = type;
                // event.highlightText = text;
                // html = event.highlightTooltipHTML;
                // contentContainer.dispatchEvent(event);
                tooltip.show(tooltipID, target, html, {
                    align: 'center',
                    preferedPositions: ['bottom', 'top', 'left', 'right'],
                    onBeforeShow: function (element) {
                        element.setAttribute('data-form-element-component', 'highlight-tooltip');
                    },
                    onShow: function (element) {
                        //lastShownTooltipElement = element;
                    }
                });
            };
            clientPackages.get('tooltip').then(function (t) {
                tooltip = t;
                execute();
            })
        };

        var hideTooltip = function () {
            if (tooltip !== null && tooltipID !== null) {
                tooltip.hide(tooltipID);
            }
        };

        var updateLinks = function () {
            if (autoHighlight.length === 0) {
                return;
            }
            var contentText = contentContainer.innerText;
            var getMatches = function (regExp) {
                var result = [];
                var match = null;
                while (match = regExp.exec(contentText)) {
                    result.push(match[0]);
                }
                result.sort(function (a, b) {
                    return b.length - a.length;
                });
                result = result.filter(function (value, index, array) {
                    return array.indexOf(value) === index;
                });
                return result;
            };
            var matches = [];
            if (hasAutoHighlight('email')) {
                var emailsToReplace = getMatches(/(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim);
                for (var i = 0; i < emailsToReplace.length; i++) {
                    var email = emailsToReplace[i];
                    matches.push([email, '<a data-rich-textarea-link-type="email">' + email + '</a>']);
                }
            }
            if (hasAutoHighlight('url')) {
                var urlsToReplace = getMatches(/(\b((http|https):\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;%=]*)?)/gim);
                for (var i = 0; i < urlsToReplace.length; i++) {
                    var url = urlsToReplace[i];
                    matches.push([url, '<a data-rich-textarea-link-type="url">' + url + '</a>']);
                }
            }
            if (hasAutoHighlight('phone')) {
                var phonesToReplace = getMatches(/(?:\+\d{1,3}\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/gim);
                for (var i = 0; i < phonesToReplace.length; i++) {
                    var phone = phonesToReplace[i];
                    matches.push([phone, '<a data-rich-textarea-link-type="phone">' + phone + '</a>']);
                }
            }
            if (hasAutoHighlight('tag')) {
                var tagsToReplace = getMatches(/#[a-zA-Z0-9-]+/gim);
                for (var i = 0; i < tagsToReplace.length; i++) {
                    var tag = tagsToReplace[i];
                    matches.push([tag, '<a data-rich-textarea-link-type="tag">' + tag + '</a>']);
                }
            }
            var getMatch = function (key) {
                for (var i = 0; i < matches.length; i++) {
                    var match = matches[i];
                    if (match[0] === key) {
                        return match[1];
                    }
                }
                return null;
            };

            var getTextUpdates = function (text, caretPosition) {
                var caretOffset = caretPosition !== null ? caretPosition.offset : null;
                // console.log('getTextUpdates', text, text.length);
                if (text.length > 0) {
                    var getParts = function (parts) {
                        for (var i = 0; i < matches.length; i++) {
                            var match = matches[i];
                            for (var j = 0; j < parts.length; j++) {
                                var part = parts[j];
                                if (part !== match[0] && getMatch(part) === null) {
                                    var subparts = part.split(match[0]);
                                    if (subparts.length > 1) {
                                        var subparts2 = [];
                                        for (var k = 0; k < subparts.length; k++) {
                                            if (k > 0) {
                                                subparts2.push(match[0]);
                                            }
                                            subparts2.push(subparts[k]);
                                        }
                                        return getParts([].concat(parts.slice(0, j), subparts2, parts.slice(j + 1)).filter(function (v) {
                                            return v.length > 0;
                                        }));
                                    }
                                }
                            }
                        }
                        return parts;
                    };
                    var html = '';
                    var isMatch = false;
                    var nodesCount = 0;
                    var caretNodeIndex = null;
                    var caretNodeOffset = null;
                    var match = getMatch(text);
                    if (match !== null) {
                        html = match;
                        isMatch = true;
                        nodesCount = 1;
                        if (caretPosition !== null) {
                            caretNodeIndex = 0;
                            caretNodeOffset = caretOffset;
                        }
                    } else {
                        var parts = getParts([text]);
                        nodesCount = parts.length;
                        if (nodesCount > 1) {
                            var nodesCounter = 0;
                            var nodesTextLength = 0;
                            for (var i = 0; i < parts.length; i++) {
                                var part = parts[i];
                                var match = getMatch(part);
                                if (match !== null) {
                                    html += match;
                                } else {
                                    html += escapeText(part);
                                }
                                if (caretPosition !== null) {
                                    var partLength = part.length;
                                    if (nodesTextLength + partLength >= caretOffset && caretNodeIndex === null) {
                                        caretNodeIndex = nodesCounter;
                                        caretNodeOffset = caretOffset - nodesTextLength;
                                    }
                                    nodesCounter++;
                                    nodesTextLength += partLength;;
                                }
                            }
                        }
                    }
                    if (html !== '') {
                        return {
                            html: html,
                            match: isMatch,
                            nodesCount: nodesCount,
                            caretNodeIndex: caretNodeIndex,
                            caretNodeOffset: caretNodeOffset
                        }
                    }
                }
                return null;
            };

            var applyTextUpdates = function (node, textUpdates, caretPosition) {
                //console.log('change - apply text updates', node, textUpdates, caretPosition.node.nodeValue, caretPosition.offset);
                //console.log('applyTextUpdates', node, textUpdates);
                var parent = node.parentNode;
                var previousSibling = node.previousSibling;
                var nextSibling = node.nextSibling;
                var tempElement = document.createElement('span');
                parent.insertBefore(tempElement, node);
                tempElement.insertAdjacentHTML('beforebegin', textUpdates.html);
                parent.removeChild(tempElement);
                if (caretPosition !== null && (node === caretPosition.node || (caretPosition.node.nodeType === 3 && caretPosition.node.parentNode === node))) {
                    var rangeNode = node;
                    for (var k = 0; k < textUpdates.nodesCount - textUpdates.caretNodeIndex; k++) {
                        rangeNode = rangeNode.previousSibling;
                    }
                    setCaretPosition(rangeNode, textUpdates.caretNodeOffset);
                }
                parent.removeChild(node);
                if (previousSibling !== null) {
                    mergeAdjacentTextNodes(previousSibling);
                }
                if (nextSibling !== null) {
                    mergeAdjacentTextNodes(nextSibling);
                }
                return true; // has change
            };

            var mergeAdjacentTextNodes = function (node) {
                var hasChange = false;
                if (node.nodeType === 3) { // text node
                    var caretPosition = getCaretPosition();
                    var caretPositionNode = caretPosition !== null ? caretPosition.node : null;
                    var caretPositionOffset = caretPosition !== null ? caretPosition.offset : null;
                    var previousSibling = node.previousSibling;
                    var nextSibling = node.nextSibling;
                    if (nextSibling !== null && nextSibling.nodeType === 3) {
                        var newCaretOffset = null;
                        if (caretPositionNode === node) {
                            newCaretOffset = caretPositionOffset;
                        } else if (caretPositionNode === nextSibling) {
                            newCaretOffset = node.nodeValue.length + caretPositionOffset;
                        }
                        node.nodeValue += nextSibling.nodeValue;
                        node.parentNode.removeChild(nextSibling);
                        if (newCaretOffset !== null) {
                            setCaretPosition(node, newCaretOffset);
                        }
                        //console.log('change - merge next', node);
                        hasChange = true;
                    }
                    if (previousSibling !== null && previousSibling.nodeType === 3) {
                        var newCaretOffset = null;
                        if (caretPositionNode === previousSibling) {
                            newCaretOffset = caretPositionOffset;
                        } else if (caretPositionNode === node) {
                            newCaretOffset = previousSibling.nodeValue.length + caretPositionOffset;
                        }
                        previousSibling.nodeValue += node.nodeValue;
                        node.parentNode.removeChild(node);
                        if (newCaretOffset !== null) {
                            setCaretPosition(previousSibling, newCaretOffset);
                        }
                        //console.log('change - merge previous', node);
                        hasChange = true;
                    }
                }
                return hasChange;
            };

            var updateNodeCaretPosition = getCaretPosition();
            var updateNode = function (node) {
                var hasChange = false;
                var nodeChildren = node.childNodes;
                var nodesToUpdate = [];
                for (var i = 0; i < nodeChildren.length; i++) {
                    nodesToUpdate.push(nodeChildren[i]);
                }
                for (var i = 0; i < nodesToUpdate.length; i++) {
                    var hasNodeChange = false;
                    var childNode = nodesToUpdate[i];
                    if (childNode.nodeType === 1) { // element node
                        if (childNode.tagName.toLowerCase() === 'a') {
                            //var href = childNode.getAttribute('href');
                            var text = childNode.innerText;
                            var textUpdates = getTextUpdates(text, updateNodeCaretPosition);
                            if (textUpdates !== null) {
                                if (!textUpdates.match) {
                                    applyTextUpdates(childNode, textUpdates, updateNodeCaretPosition);
                                    hasChange = true;
                                    hasNodeChange = true;
                                }
                            } else { // the content inside the A tag is no longer a valid link
                                var newNode = document.createTextNode(text);
                                node.replaceChild(newNode, childNode);
                                //console.log('change - remove link');
                                if (updateNodeCaretPosition.node === childNode || (updateNodeCaretPosition.node.nodeType === 3 && updateNodeCaretPosition.node.parentNode === childNode)) {
                                    setCaretPosition(newNode, updateNodeCaretPosition.offset);
                                }
                                mergeAdjacentTextNodes(newNode);
                                hasChange = true;
                                hasNodeChange = true;
                            }
                        } else {
                            if (updateNode(childNode)) {
                                hasChange = true;
                                hasNodeChange = true;
                            }
                        }
                    } else if (childNode.nodeType === 3) { // text node
                        var textUpdates = getTextUpdates(childNode.textContent, updateNodeCaretPosition);
                        if (textUpdates !== null) {
                            applyTextUpdates(childNode, textUpdates, updateNodeCaretPosition);
                            hasChange = true;
                            hasNodeChange = true;
                        }
                    }
                    if (hasNodeChange) {
                        updateNodeCaretPosition = getCaretPosition();
                    }
                }
                return hasChange;
            };
            for (var i = 0; i < 100; i++) {
                //console.time('updateLinks');
                var hasChange = updateNode(contentContainer);
                //console.timeEnd('updateLinks');
                if (!hasChange) {
                    break;
                }
            }

        };

        var escapeTextCache = new Map();
        var escapeText = function (text) {
            var cachedValue = escapeTextCache.get(text);
            if (typeof cachedValue !== 'undefined') {
                return cachedValue;
            }
            let div = document.createElement('div');
            div.innerText = text;
            var result = div.innerHTML;
            escapeTextCache.set(text, result);
            return result;
        };

        contentContainer.getFormElementContainer = function () {
            return element;
        };
        var dispatchChangeEvent = false;
        contentContainer.addEventListener('input', function () {
            hideTooltip();
            processChange(100);
            updateLinks();
            dispatchChangeEvent = true;
        });
        contentContainer.addEventListener('blur', function () {
            if (dispatchChangeEvent) {
                contentContainer.dispatchEvent(new Event('change', { 'bubbles': true }));
                dispatchChangeEvent = false;
            }
            //hideTooltip(); // hides the tooltip when clicked
        });
        updateLinks();

        contentContainer.addEventListener("click", () => {
            var node = window.getSelection().anchorNode;
            var selectedNode = node.nodeType === 3 ? node.parentNode : node;
            if (contentContainer.contains(selectedNode) && selectedNode.getAttribute('data-rich-textarea-link-type') !== null) {
                showTooltip(selectedNode);
            } else {
                hideTooltip();
            }
        });

        var getNodeTagName = function (node) {
            return node !== null && node.nodeType === 1 ? node.tagName.toLowerCase() : null;
        };
        var isTextNode = function (node) {
            return node !== null && node.nodeType === 3;
        }
        var convertNodeToText = function (node, isTheTarget) {
            var text = "";
            var tagName = getNodeTagName(node);
            if (tagName !== null) {
                var previousSibling = isTheTarget ? null : node.previousSibling;
                var nextSibling = isTheTarget ? null : node.nextSibling;
                if (tagName === 'div') {
                    var children = node.childNodes;
                    var childrenCount = children.length;
                    var firstChild = node.firstChild;
                    var secondChild = firstChild !== null ? firstChild.nextSibling : null;
                    var lastChild = node.lastChild;
                    if (childrenCount > 0) {
                        if (previousSibling !== null && getNodeTagName(previousSibling) !== 'div') {
                            text += "\n";
                        }
                        if (childrenCount === 1 && getNodeTagName(firstChild) === 'br') { // '<div><br></div>'
                            text += "\n";
                        } else if (childrenCount === 1 && isTextNode(firstChild) && firstChild.textContent === "\n") { // '<div>\n</div>'
                            // do nothing
                        } else if (childrenCount === 2 && getNodeTagName(firstChild) === 'br' && isTextNode(secondChild) && secondChild.textContent === "\n") {  // '<div><br>\n</div>'
                            text += "\n";
                        } else {
                            var childrenText = "";
                            for (var i = 0; i < childrenCount; i++) {
                                var child = children[i];
                                if (lastChild === child && getNodeTagName(lastChild) === 'br') { // <div>text<br></div>
                                    continue;
                                }
                                childrenText += convertNodeToText(child, false);
                            }
                            if (childrenText !== "\n") { // <div><span><br></span></div>
                                text += childrenText;
                            }
                            if (nextSibling !== null) {
                                text += "\n";
                            }
                        }
                    }
                } else if (tagName === 'br') {
                    if (nextSibling !== null && getNodeTagName(nextSibling) === 'div') { // text<br><div>

                    } else {
                        text += "\n";
                    }
                } else if (tagName === 'a') {
                    text += node.innerText;
                } else if (tagName === 'span') {
                    var children = node.childNodes;
                    var childrenCount = children.length;
                    for (var i = 0; i < childrenCount; i++) {
                        text += convertNodeToText(children[i], false);
                    }
                }
            } else if (isTextNode(node)) {
                text += node.textContent;
            }
            return text;
        };

        element.getValue = function () {  // Returns empty string if the rich-textarea is empty
            return convertNodeToText(contentContainer, true);
        };

        element.setValue = function (value) {
            if (value !== element.getValue()) { // prevent moving the caret
                contentContainer.innerText = value;
                processChange(100);
                updateLinks();
            }
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        element.isActive = function () {
            var activeElement = document.activeElement;
            return contentContainer === activeElement || contentContainer.contains(activeElement);
        };

    })(elements[i]);
}