/* ============================================
   ISOM2700 速通笔记 · 共享 JS 工具
   ============================================ */
'use strict';

// Normal PDF
function normalPDF(x, mu, sigma) {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

// Inverse normal CDF (Beasley-Springer-Moro approximation)
function invNormCDF(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0, -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0, 3.754408661907416e0];
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q, r;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= pHigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1-p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

// ============================================
// EXERCISES · 练习题逻辑
// ============================================
function initExercises() {
  const exercises = document.querySelectorAll('.exercise');
  if (!exercises.length) return;

  let solved = 0;
  let attempted = 0;
  const total = exercises.length;

  // Score tracker
  const tracker = document.querySelector('.score-tracker');
  function updateTracker() {
    if (!tracker) return;
    const scoreEl = tracker.querySelector('.score-num');
    const progressEl = tracker.querySelector('.progress');
    if (scoreEl) scoreEl.textContent = solved + '/' + total;
    if (progressEl) progressEl.textContent = '已尝试 ' + attempted + ' / ' + total;
  }
  updateTracker();

  // Reset button
  const resetBtn = tracker?.querySelector('.score-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      exercises.forEach(ex => resetExercise(ex));
      solved = 0;
      attempted = 0;
      updateTracker();
    });
  }

  exercises.forEach((ex, idx) => {
    const type = ex.dataset.type;
    const answer = ex.dataset.answer;
    const tolerance = parseFloat(ex.dataset.tolerance || '0.5');
    const submitBtn = ex.querySelector('.ex-submit');
    const revealBtn = ex.querySelector('.ex-reveal');
    const feedback = ex.querySelector('.ex-feedback');
    const solution = ex.querySelector('.ex-solution');

    if (!feedback || !solution) return;

    function showFeedback(msg, kind) {
      feedback.textContent = msg;
      feedback.className = 'ex-feedback show ' + kind;
    }

    function markSolved(correctly) {
      if (ex.dataset.scored === '1') return;
      ex.dataset.scored = '1';
      attempted++;
      if (correctly) {
        solved++;
        ex.classList.add('solved');
      } else {
        ex.classList.add('wrong');
      }
      updateTracker();
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (type === 'mcq') {
          const checked = ex.querySelector('input[type="radio"]:checked');
          if (!checked) {
            showFeedback('请先选一个答案。', 'info');
            return;
          }
          const correctIdx = parseInt(answer, 10);
          const myIdx = parseInt(checked.value, 10);
          ex.querySelectorAll('.ex-options label').forEach((lbl, i) => {
            lbl.classList.remove('correct', 'wrong');
            if (i === correctIdx) lbl.classList.add('correct');
            else if (i === myIdx) lbl.classList.add('wrong');
          });
          // Lock options
          ex.querySelectorAll('.ex-options input').forEach(i => i.disabled = true);
          const correct = myIdx === correctIdx;
          showFeedback(correct ? '✓ 正确!' : '✗ 错了。正确选项已标出。', correct ? 'correct' : 'wrong');
          solution.classList.add('show');
          markSolved(correct);
          submitBtn.disabled = true;
        } else if (type === 'mcq-multi') {
          const checked = [...ex.querySelectorAll('input[type="checkbox"]:checked')].map(c => parseInt(c.value, 10)).sort((a,b)=>a-b);
          if (!checked.length) {
            showFeedback('请至少选一个选项。', 'info');
            return;
          }
          const correctSet = answer.split(',').map(x => parseInt(x.trim(), 10)).sort((a,b)=>a-b);
          ex.querySelectorAll('.ex-options label').forEach((lbl, i) => {
            lbl.classList.remove('correct', 'wrong');
            if (correctSet.includes(i)) lbl.classList.add('correct');
            else if (checked.includes(i)) lbl.classList.add('wrong');
          });
          ex.querySelectorAll('.ex-options input').forEach(i => i.disabled = true);
          const correct = checked.length === correctSet.length && checked.every((v,k) => v === correctSet[k]);
          showFeedback(correct ? '✓ 全对!' : '✗ 部分错。正确选项已标出。', correct ? 'correct' : 'wrong');
          solution.classList.add('show');
          markSolved(correct);
          submitBtn.disabled = true;
        } else if (type === 'numeric') {
          const input = ex.querySelector('.ex-input input');
          const val = parseFloat(input.value);
          if (isNaN(val)) {
            showFeedback('请输入一个数字。', 'info');
            return;
          }
          const ans = parseFloat(answer);
          const diff = Math.abs(val - ans);
          const correct = diff <= tolerance;
          if (correct) {
            showFeedback('✓ 正确! 答案 = ' + ans, 'correct');
          } else {
            showFeedback('✗ 不对。你 = ' + val + ',答案 = ' + ans + ' (差 ' + diff.toFixed(2) + ')', 'wrong');
          }
          input.disabled = true;
          solution.classList.add('show');
          markSolved(correct);
          submitBtn.disabled = true;
        }
      });

      // Allow Enter key for numeric inputs
      if (type === 'numeric') {
        const input = ex.querySelector('.ex-input input');
        input?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') submitBtn.click();
        });
      }
    }

    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        if (ex.dataset.scored !== '1') {
          // Show correct answer
          if (type === 'mcq') {
            const correctIdx = parseInt(answer, 10);
            ex.querySelectorAll('.ex-options label').forEach((lbl, i) => {
              if (i === correctIdx) lbl.classList.add('correct');
            });
            ex.querySelectorAll('.ex-options input').forEach(i => i.disabled = true);
          } else if (type === 'mcq-multi') {
            const correctSet = answer.split(',').map(x => parseInt(x.trim(), 10));
            ex.querySelectorAll('.ex-options label').forEach((lbl, i) => {
              if (correctSet.includes(i)) lbl.classList.add('correct');
            });
            ex.querySelectorAll('.ex-options input').forEach(i => i.disabled = true);
          } else if (type === 'numeric') {
            const input = ex.querySelector('.ex-input input');
            input.value = answer;
            input.disabled = true;
          }
          showFeedback('直接看答案了 → 没计入得分', 'info');
          attempted++;
          ex.dataset.scored = '1';
          updateTracker();
        }
        solution.classList.add('show');
        if (submitBtn) submitBtn.disabled = true;
        revealBtn.disabled = true;
      });
    }

    // Re-render KaTeX inside solution lazily (handle delayed reveal)
    if (window.renderMathInElement) {
      try { window.renderMathInElement(ex); } catch(e) {}
    }
  });

  function resetExercise(ex) {
    delete ex.dataset.scored;
    ex.classList.remove('solved','wrong');
    const fb = ex.querySelector('.ex-feedback');
    const sol = ex.querySelector('.ex-solution');
    fb?.classList.remove('show','correct','wrong','info');
    sol?.classList.remove('show');
    ex.querySelectorAll('.ex-options label').forEach(l => l.classList.remove('correct','wrong'));
    ex.querySelectorAll('input').forEach(i => { i.disabled = false; if (i.type !== 'radio' && i.type !== 'checkbox') i.value = ''; else i.checked = false; });
    ex.querySelectorAll('button').forEach(b => b.disabled = false);
  }
}

// Auto-init exercises after DOM + KaTeX ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initExercises, 100));
} else {
  setTimeout(initExercises, 100);
}

// Common Chart.js options
const baseChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 200 },
  plugins: {
    legend: { labels: { font: { family: 'JetBrains Mono', size: 10 } } },
    tooltip: { titleFont: { family: 'JetBrains Mono' }, bodyFont: { family: 'JetBrains Mono' } }
  },
  scales: {
    x: { ticks: { font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { ticks: { font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)' } }
  }
};
