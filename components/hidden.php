<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$name = (string) $component->name;
$value = (string) $component->value;
$style = (string) $component->style;
$class = (string) $component->class;

echo '<html><body>';
echo '<input name="' . htmlentities($name) . '" class="ivopetkov-form-elements-hidden-element-input' . (isset($class[0]) ? ' ' . $class : $class) . '" type="hidden" value="' . htmlentities($value) . '"' . (isset($style[0]) ? ' style="' . htmlentities($style) . '"' : '') . '/>';
echo '</body></html>';
