#!/bin/zsh
# Builds and walks one run at a time, each once the machine is free (1-minute load under 6).
# Reads "<case> <arm> <n> [agent] [lang] [then]" lines on stdin, e.g.
# `printf 'docs a 1 claude cn\ndocs b 1 claude cn premium\n' | eval/batch.sh`; an old task takes no
# agent. With a follow-up (eval/then/<then>), both builds are walked.
cd "${0:A:h}/.."
runs=${EVAL_RUNS:-/Users/Shared/ui-playbook-eval-runs}
while read -r task arm n agent lang then; do
  until [[ $(sysctl -n vm.loadavg | awk '{print ($2 < 6)}') == 1 ]]; do sleep 30; done
  if [[ -n $agent ]]; then lang=${lang:-cn}; build=$agent-$arm-$lang-$n; flags=(--agent $agent --lang $lang); else build=$arm-$n; flags=(); fi
  builds=($build)
  if [[ -n $then ]]; then flags+=(--then $then); builds+=($build-then-$then); fi
  echo "$(date +%H:%M) build $task $build${then:+ then $then}"
  node eval/run.mjs $task $arm $n $flags < /dev/null || { echo "$(date +%H:%M) run failed: $task $build"; continue; }
  for b in $builds; do
    node eval/walk.mjs $runs/$task*/$b < /dev/null || echo "$(date +%H:%M) walk failed: $task $b"
  done
done
echo "$(date +%H:%M) batch done"
