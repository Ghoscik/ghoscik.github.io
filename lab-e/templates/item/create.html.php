<?php

/** @var \App\Model\Item $item */
/** @var \App\Service\Router $router */

$title = 'Dodaj nowy przedmiot';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Dodaj nowy przedmiot</h1>
    <form action="<?= $router->generatePath('item-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="item-create">
    </form>

    <a href="<?= $router->generatePath('item-index') ?>">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
