
if (document.getElementById('text-top') != null)
{
    var animation = bodymovin.loadAnimation({
      container: document.getElementById('text-top'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/js/animation/test-main.json'
    });
}
if (document.getElementById('olymp9-top') != null)
{
    var animation = bodymovin.loadAnimation({
      container: document.getElementById('olymp9-top'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/js/animation/olymp9-top.json'
    });
}
if (document.getElementById('olymp8-top') != null)
{
    var animation = bodymovin.loadAnimation({
      container: document.getElementById('olymp8-top'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/js/animation/olymp8-top.json'
    });
}

if (document.getElementById('course-top') != null)
{
    var animation2 = bodymovin.loadAnimation({
      container: document.getElementById('course-top'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/js/animation/course.json'
    });
}

if (document.getElementById('flashcards-preview') != null)
{
    var animation3 = bodymovin.loadAnimation({
      container: document.getElementById('flashcards-preview'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/js/animation/flashcards.json'
    });
}
