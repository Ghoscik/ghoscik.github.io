<?php

/** @var \App\Model\Item $item */
/** @var \App\Service\Router $router */

$title = "{$item->getName()} ({$item->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $item->getName() ?></h1>
    <article>
        <?= nl2br(htmlspecialchars($item->getDescription())); ?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('item-index') ?>">Powrót do listy</a></li>
        <li><a href="<?= $router->generatePath('item-edit', ['id' => $item->getId()]) ?>">Edytuj</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
