export default class Outcomes {
    onTestRunEnd(modules) {
        const lines = modules.flatMap((module) =>
            [...module.children.allTests()].flatMap((test) => {
                const result = test.result();
                if (result.state !== 'failed') {
                    return [`${result.state} ${test.name}`];
                }
                const [error] = result.errors;
                const evidence = (error.diff ?? error.message).split('\n').map((line) => `    ${line}`.trimEnd());
                return [`${result.state} ${test.name}`, ...evidence];
            }),
        );
        process.stdout.write(`${lines.join('\n')}\n`);
    }
}
