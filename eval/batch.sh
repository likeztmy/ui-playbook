#!/bin/zsh
# Builds and walks one run at a time, each once the machine is free (1-minute load under 6).
# Reads "<case> <arm> <n> [agent] [lang]" lines on stdin, e.g.
# `printf 'docs a 1 claude cn\ndocs b 1 claude cn\n' | eval/batch.sh`; an old task takes no agent.
cd "${0:A:h}/.."
runs=${EVAL_RUNS:-/Users/Shared/ui-playbook-eval-runs}
while read -r task arm n agent lang; do
  until [[ $(sysctl -n vm.loadavg | awk '{print ($2 < 6)}') == 1 ]]; do sleep 30; done
  if [[ -n $agent ]]; then lang=${lang:-cn}; build=$agent-$arm-$lang-$n; flags=(--agent $agent --lang $lang); else build=$arm-$n; flags=(); fi
  echo "$(date +%H:%M) build $task $build"
  node eval/run.mjs $task $arm $n $flags < /dev/null || { echo "$(date +%H:%M) run failed: $task $build"; continue; }
  node eval/walk.mjs $runs/$task*/$build < /dev/null || echo "$(date +%H:%M) walk failed: $task $build"
done
echo "$(date +%H:%M) batch done"
