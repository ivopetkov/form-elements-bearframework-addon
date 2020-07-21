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
$attributes['type'] = 'text';

echo '<html><head>';
echo '<style>' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('textbox', $attributes) . '>';
echo '<label>';
echo Utilities::getLabelElement($attributes);
echo '<input ' . Utilities::getElementAttributes($attributes) . '/>';
echo '</label>';
//$js = file_get_contents(__DIR__ . '/../dev/api.textbox.js');
$js = include __DIR__ . '/textbox.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
