
EXAMPLES = $(foreach EXAMPLE, $(wildcard examples/*.js), $(EXAMPLE))
.PHONY: $(EXAMPLES)
$(EXAMPLES): ; node $@ && echo

.PHONY: test
test: $(EXAMPLES)
