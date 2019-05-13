<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$attributes = $component->getAttributes();

$label = (string) $component->label;
if (isset($attributes['label'])) {
    unset($attributes['label']);
}
$hasLabel = isset($label[0]);

$value = (string) $component->value;
if (isset($attributes['value'])) {
    unset($attributes['value']);
}

if ($hasLabel && !isset($attributes['id'])) {
    $attributes['id'] = 'fe' . md5(uniqid());
}
$attributes['data-form-element-component'] = 'textarea';

$attributesText = implode(' ', array_map(function ($name, $value) {
            return $name . '="' . htmlentities($value) . '"';
        }, array_keys($attributes), $attributes));

echo '<html><body>';
echo '<div data-form-element="textarea">';
if ($hasLabel) {
    echo '<label for="' . htmlentities($attributes['id']) . '" data-form-element-component="label">' . htmlspecialchars($label) . '</label>';
}
echo '<textarea  ' . $attributesText . '>' . htmlentities($value) . '</textarea>';
echo '</div>';
echo '</body></html>';
