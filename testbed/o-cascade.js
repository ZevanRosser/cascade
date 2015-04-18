 c = cascade
      (document.body, 'setAttribute')
      ('style', 'margin: 0; padding: 0')
      .method('appendChild')
      (canvas = document.createElement('canvas'))
      .dive({
        width: window.innerWidth,
        height: window.innerHeight
      }).method('getContext')
      ('2d')
      .dive({
        fillStyle: 'red'
      })
      .method('fillRect')
      (0, 0, canvas.width, canvas.height)
      .leap(console, 'log')
      ('done');

