<?php
    /** @var $item ?\App\Model\Item */
?>

<div class="form-group">
    <label for="name">Nazwa przedmiotu</label>
    <input type="text" id="name" name="item[name]" value="<?= $item ? $item->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Opis</label>
    <textarea id="description" name="item[description]"><?= $item ? $item->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Zapisz">
</div>
