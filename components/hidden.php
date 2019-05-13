<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$attributes = $component->getAttributes();

$attributes['data-form-element-component'] = 'input';
$attributes['type'] = 'hidden';

$attributesText = implode(' ', array_map(function ($name, $value) {
            return $name . '="' . htmlentities($value) . '"';
        }, array_keys($attributes), $attributes));

echo '<html><body>';
echo '<div data-form-element="hidden">';
echo '<input ' . $attributesText . '/>';
echo '</div>';
echo '</body></html>';
