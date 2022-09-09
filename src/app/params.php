<?php

use components\Params;

require_once 'vendor/autoload.php';
//load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if (!empty($_POST)) {
  $saver = new Params();
  $saver->save();
}

$ini_array = parse_ini_file('params.ini');
?>

<form action="" method="post" style="display: flex; flex-direction: column">

    <label for="product_name">Zoho Product Name</label>
    <input type="text" id="product_name" name="product_name" style="margin-bottom: 10px; max-width: 300px" value="<?= $ini_array[
      'PRODUCT_NAME'
    ] ?>" placeholder="<?= $ini_array['PRODUCT_NAME'] ?>">

    <label for="product_id">Zoho Product ID</label>
    <input type="text" id="product_id" name="product_id" style="margin-bottom: 10px; max-width: 300px" value="<?= $ini_array[
      'PRODUCT_ID'
    ] ?>" placeholder="<?= $ini_array['PRODUCT_ID'] ?>">

    <label for="gtm">GTM</label>
    <input type="text" id="gtm" name="gtm" value="<?= $ini_array[
      'GTM'
    ] ?>" placeholder="<?= $ini_array['GTM'] ?>">

    <label for="leeloo_hash">Leeloo Hash</label>
    <input type="text" id="leeloo_hash" name="leeloo_hash" style="margin-bottom: 10px; max-width: 300px" value="<?= $ini_array[
      'LEELOO_HASH'
    ] ?>" placeholder="<?= $ini_array['LEELOO_HASH'] ?>">

    <label for="start_date">Start Date</label>
    <input type="text" id="start_date" name="start_date" style="margin-bottom: 10px; max-width: 300px" value="<?= $ini_array[
      'START_DATE'
    ] ?>" placeholder="<?= $ini_array['START_DATE'] ?>">

    <label for="password">Password</label>
    <input type="password" id="password" name="password" style="margin-bottom: 10px; max-width: 300px">

    <button type="submit" style="max-width: 300px">Save</button>
</form>