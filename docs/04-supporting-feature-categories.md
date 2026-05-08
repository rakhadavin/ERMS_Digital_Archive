# Supporting Feature — Standard Category Vocabularies

## Purpose

Standard Category Vocabularies manage the official archive classification structure.

This feature ensures consistent document classification by maintaining a controlled vocabulary of:

1. Main categories
2. Sub-categories

## Route

```txt
/categories
```

## Main Category

A main category contains:

- `code_MC`
- `name_MC`
- `desc_MC`

## Sub-Category

A sub-category contains:

- `code_MC`
- `code_SC`
- `name_SC`
- `desc_SC`
- `retention`

Each sub-category belongs to one main category.

## Page Layout

Recommended layout:

- Left panel: list of main categories
- Right panel: selected main category detail and its sub-categories

Alternative layout:

- Main category cards
- Expandable sub-category section under each card

## Main Actions

Users can:

1. Add main category
2. Add sub-category
3. Edit main category
4. Edit sub-category
5. See related documents

## Add Main Category Modal

When user clicks `Add Main Category`, open a modal.

Fields:

- Main category code
- Main category name
- Main category description

The modal should also allow adding sub-categories inline.

Sub-category fields:

- Sub-category code
- Sub-category name
- Sub-category description
- Retention period in years

User can click:

```txt
+ Add Sub-Category
```

to add more sub-category input groups.

## Add Sub-Category Modal

When user adds a sub-category under an existing main category, the modal should include:

- `code_SC`
- `name_SC`
- `desc_SC`
- `retention`

The `code_MC` should be automatically derived from the selected main category.

## Edit Behavior

Users can edit:

- `name_MC`
- `desc_MC`
- `name_SC`
- `desc_SC`
- `retention`

Be careful when editing classification codes.

Recommended rule:

Do not allow editing `code_MC` or `code_SC` if related documents already exist.

## See Related Documents

This action displays documents related to a selected main category or sub-category.

### If triggered from main category

Show documents where:

```txt
document.code_MC = selected code_MC
```

### If triggered from sub-category

Show documents where:

```txt
document.code_SC = selected code_SC
```

## Related Documents Panel

Use a two-column layout.

### Left Side

List related documents with:

- Title
- `nomor_dokumen`
- `tanggal_dokumen`
- Main category
- Sub-category
- Retention year

### Right Side

Show selected document detail:

- Metadata fields
- Download button
- Read / Preview button
- Musnahkan button if retention is within 6 months
- Pertahankan button if retention is within 6 months

## Validation Rules

### Main Category

- `code_MC` is required.
- `name_MC` is required.
- `code_MC` must be unique.

### Sub-Category

- `code_SC` is required.
- `name_SC` is required.
- `retention` is required.
- `retention` must be a positive number.
- `code_SC` must be unique.

## Minimum Viable Version

1. Display main categories.
2. Display sub-categories.
3. Add main category.
4. Add sub-category.
5. Edit names and descriptions.
6. Show related documents.
