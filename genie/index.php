<?php
define('BASE', '../demo/');
define('CACHE_DIRECTORY', './temp/');

header('Content-Type: application/javascript; charset=utf-8');

if(isset($_GET['module']) && is_array($_GET['module'])) {
    $file = CACHE_DIRECTORY . sha1(json_encode($_GET['module'])) . '.js';

    if(file_exists($file)) {
        @readfile($file);
    } else {
        if(!is_dir(CACHE_DIRECTORY)) {
            mkdir(CACHE_DIRECTORY, 0770, true);
        }

        ob_start();

        foreach($_GET['module'] as $module) {
            if(!@readfile(BASE . $module . '.js')) {
                ob_end_clean();
                header('HTTP/1.0 404 Not Found');
                die();
            }

            echo chr(10);
        }

        $content = ob_get_contents();
        ob_end_flush();

        @file_put_contents($file, $content, LOCK_EX);
    }
}

die();
?>