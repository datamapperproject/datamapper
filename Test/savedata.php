
    <?php

$data = $_POST['data'];
$f = fopen('file.txt', 'w+');
fwrite(f, $data);
fclose($f);
?>

