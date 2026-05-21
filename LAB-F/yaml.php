<?php

$data = [
    'name' => 'Bastian Wierzchnicki',
    'index' => '57947',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;
