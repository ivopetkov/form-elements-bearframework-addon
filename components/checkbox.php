<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$attributes['data-form-element-component'] = 'input';
$attributes['type'] = 'checkbox';

echo '<html><head>';
echo '<style>' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('checkbox', $attributes) . '>';
echo '<label>';
echo '<input ' . Utilities::getElementAttributes($attributes) . '/>';
echo Utilities::getLabelElement($attributes);
echo '</label>';
//$js = file_get_contents(__DIR__ . '/../dev/api.checkbox.js');
$js = include __DIR__ . '/checkbox.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
