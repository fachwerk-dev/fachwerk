# Generating random values

## random

`random()` is a function returning a floating point number between `min` and `max` argments.

If no arguments are passed, a number between `0` and `1` is returned.

```
function random(min: number = 0, max: number = 1): number
```

```md
{{ random() }}
{{ random(0, 10) }}
```

## randomint

`randomint()` is a function returning an integer number between `min` and `max` argments.

```
function randomint(min: number, max: number): number
```

```md
{{ randomint(0, 10) }}
```

## Prior art

https://designstem.github.io/fachwerk/docs/#/random

https://visualia.github.io/visualia_original/#helper-functions_random

https://visualia.netlify.app/utils/random.html
