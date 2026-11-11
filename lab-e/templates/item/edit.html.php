<?php

/** @var \App\Model\Item $item */
/** @var \App\Service\Router $router */

$title = "Edycja: {$item->getName()} ({$item->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('item-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="item-edit">
        <input type="hidden" name="id" value="<?= $item->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('item-index') ?>">Powrót do listy</a>
        </li>
        <li>
            <form action="<?= $router->generatePath('item-delete') ?>" method="post">
                <input type="submit" value="Usuń" onclick="return confirm('Czy na pewno chcesz usunąć ten przedmiot?')">
                <input type="hidden" name="action" value="item-delete">
                <input type="hidden" name="id" value="<?= $item->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
