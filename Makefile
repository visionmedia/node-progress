
EXAMPLES = $(foreach EXAMPLE, $(wildcard examples/*.js), $(EXAMPLE))

.PHONY: test
test: test/interrupt.js $(EXAMPLES)

.PHONY: test/interrupt.js
test/interrupt.js: ; node $@

.PHONY: $(EXAMPLES)
$(EXAMPLES): ; node $@ && echo
