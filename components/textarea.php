<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$label = (string) $component->label;
$name = (string) $component->name;
$value = (string) $component->value;
$style = (string) $component->style;
$class = (string) $component->class;
$placeholder = (string) $component->placeholder;

$elementID = 'fe' . md5(uniqid());

echo '<html><body>';
echo '<div class="ivopetkov-form-elements-element ivopetkov-form-elements-textarea">';
if (isset($label[0])) {
    echo '<label for="' . htmlentities($elementID) . '" class="ivopetkov-form-elements-element-label ivopetkov-form-elements-textarea-label">' . htmlspecialchars($label) . '</label>';
}
echo '<textarea name="' . htmlentities($name) . '" id="' . htmlentities($elementID) . '" class="ivopetkov-form-elements-textarea-element-textarea' . (isset($class[0]) ? ' ' . $class : $class) . '"' . (isset($style[0]) ? ' style="' . htmlentities($style) . '"' : '') . '"' . (isset($placeholder[0]) ? ' placeholder="' . htmlentities($placeholder) . '"' : '') . '>' . htmlentities($value) . '</textarea>';
echo '</div>';
echo '</body></html>';
