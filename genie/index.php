<?php
define('BASE', '../demo/');
define('CACHE_DIRECTORY', './temp/');

header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: public, max-age=31536000, immutable');
header('Vary: Accept-Encoding');
header_remove('X-Powered-By');

if(isset($_GET['module']) && is_array($_GET['module'])) {
    $file = CACHE_DIRECTORY . sha1(json_encode($_GET['module'])) . '.js';

    if(file_exists($file)) {
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', @filemtime($file)) . ' GMT');

        @readfile($file);
    } else {
        if(!is_dir(CACHE_DIRECTORY)) {
            mkdir(CACHE_DIRECTORY, 0770, true);
        }

        ob_start();

        foreach($_GET['module'] as $module) {
            preg_match('/(?P<name>.+)@(?P<version>.+)/', $module, $module);

            if(!empty($module['name']) && !empty($module['version'])) {
                if(!@readfile(BASE . $module['name'] . '.js')) {
                    ob_end_clean();
                    header('HTTP/1.0 404 Not Found');
                    die();
                }

                echo chr(10);
            } else {
                ob_end_clean();
                header('HTTP/1.0 400 Bad Request');
                die();
            }
        }

        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');

        $content = ob_get_contents();
        ob_end_flush();

        @file_put_contents($file, $content, LOCK_EX);
    }
}

die();
?>