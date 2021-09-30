<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

namespace IvoPetkov\BearFrameworkAddons\FormElements;

class Utilities
{
    static function getAttributesString(array $attributes): string
    {
        return implode(' ', array_map(function ($name, $value) {
            return $name . '="' . htmlentities($value) . '"';
        }, array_keys($attributes), $attributes));
    }

    static function getContainerAttributes(string $type, array $attributes): string
    {
        $containerAttributes = [];
        $containerAttributes['data-form-element-type'] = $type;
        if (isset($attributes['id'])) {
            $containerAttributes['id'] = $attributes['id'];
        }
        if (isset($attributes['visibility'])) {
            $containerAttributes['data-form-element-visibility'] = $attributes['visibility'] === 'true' ? '1' : '0';
        }
        if (isset($attributes['style'])) {
            $containerAttributes['style'] = $attributes['style'];
        }
        return self::getAttributesString($containerAttributes);
    }

    static function getElementAttributes(array $attributes): string
    {
        $elementAttributes = $attributes;
        if (isset($elementAttributes['id'])) {
            unset($elementAttributes['id']);
        }
        if (isset($elementAttributes['label'])) {
            unset($elementAttributes['label']);
        }
        if (isset($elementAttributes['visibility'])) {
            unset($elementAttributes['visibility']);
        }
        if (isset($elementAttributes['style'])) {
            unset($elementAttributes['style']);
        }
        return self::getAttributesString($elementAttributes);
    }

    static function getLabelElement(array $attributes): string
    {
        if (isset($attributes['label'])) {
            return '<span data-form-element-component="label">' . htmlspecialchars($attributes['label']) . '</span>';
        }
        return '';
    }

    static function getDefaultStyles(): string
    {
        return '[data-form-element-type][data-form-element-visibility="0"]{display:none !important;}'; // !important is needed because the element may have style="display:..."
    }
}
