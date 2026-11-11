<?php

/** @var \App\Model\Item[] $items */
/** @var \App\Service\Router $router */

$title = 'Lista przedmiotów';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Lista przedmiotów</h1>

    <a href="<?= $router->generatePath('item-create') ?>">Dodaj nowy przedmiot</a>

    <ul class="index-list">
        <?php foreach ($items as $item): ?>
            <li><h3><?= $item->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('item-show', ['id' => $item->getId()]) ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('item-edit', ['id' => $item->getId()]) ?>">Edytuj</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
