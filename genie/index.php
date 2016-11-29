<?php
define('BASE', '../demo/');

header('Content-Type: application/javascript; charset=utf-8');

ob_start();

if(isset($_GET['module']) && is_array($_GET['module'])) {
    foreach($_GET['module'] as $module) {
        if(!@readfile(BASE . $module . '.js')) {
            ob_end_clean();
            header('HTTP/1.0 404 Not Found');
            die();
        }

        echo chr(10);
    }
}

ob_end_flush();

die();
?>