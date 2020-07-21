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
$attributes['type'] = 'hidden';

echo '<html><body>';
echo '<div ' . Utilities::getContainerAttributes('hidden', $attributes) . '>';
echo '<input ' . Utilities::getElementAttributes($attributes) . '/>';
//$js = file_get_contents(__DIR__ . '/../dev/api.hidden.js');
$js = include __DIR__ . '/hidden.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
